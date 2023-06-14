#include <algorithm>
#include <cmath>
#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/time.hpp>
#include <eosio/multi_index.hpp>
#include <eosio/contract.hpp>
#include <eosio/action.hpp>
#include <eosio/system.hpp>
#include <eosio/print.hpp>
#include <eosio/datastream.hpp>

using namespace eosio;

#define HUNDR_PERCENT 1000000

class [[eosio::contract]] secret : public eosio::contract {

public:
    secret( eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds ): eosio::contract(receiver, code, ds)
    {}
    void apply(uint64_t receiver, uint64_t code, uint64_t action);   
  
    static void add_balance(eosio::name payer, eosio::asset quantity, eosio::name contract);
    static void sub_balance(eosio::name username, eosio::asset quantity, eosio::name contract);

    [[eosio::action]] void createprod(name host, uint64_t referral_percent, uint64_t core_cashback_percent, std::string title, std::string description, std::string encrypted_data, eosio::name token_contract, asset price);
    [[eosio::action]] void editprod(eosio::name host, uint64_t referral_percent, uint64_t core_cashback_percent, uint64_t product_id, std::string title, std::string description, std::string encrypted_data, asset price);
    [[eosio::action]] void derivesecret(eosio::name host, uint64_t user_product_id, std::string encrypted_data);

    [[eosio::action]] void buysecret(eosio::name buyer, eosio::name host, uint64_t flow_id, std::string meta);
    [[eosio::action]] void addflow(name host, uint64_t product_id, eosio::time_point_sec start_at, eosio::time_point_sec closed_at, std::string encrypted_data, std::string meta);        
    [[eosio::action]] void withdraw(eosio::name host, uint64_t balance_id);

    /**
    * @ingroup public_consts 
    * @{ 
    */
    static constexpr eosio::name _me = "secret"_n; 
    static constexpr eosio::name _unicore = "unicore"_n;   
    /**
    * @}
    */
    
};


  static uint128_t combine_ids(const uint64_t &x, const uint64_t &y) {
      return (uint128_t{x} << 64) | y;
  };



    
    /**
     * @brief      Таблица промежуточного хранения балансов пользователей.
     * @ingroup public_tables
     * @table balance
     * @contract _me
     * @scope username
     * @details Таблица баланса пользователя пополняется им путём совершения перевода на аккаунт контракта p2p. При создании ордера используется баланс пользователя из этой таблицы. Чтобы исключить необходимость пользователю контролировать свой баланс в контракте p2p, терминал доступа вызывает транзакцию с одновременно двумя действиями: перевод на аккаунт p2p и создание ордера на ту же сумму. 
     */

    struct [[eosio::table, eosio::contract("secret")]] ubalance {
        uint64_t id;                    /*!< идентификатор баланса */
        eosio::name contract;           /*!< имя контракта токена */
        eosio::asset quantity;          /*!< количество токенов на балансе */

        uint64_t primary_key() const {return id;} /*!< return id - primary_key */
        uint128_t byconsym() const {return combine_ids(contract.value, quantity.symbol.code().raw());} /*!< return combine_ids(contract, quantity) - комбинированный secondary_index 2 */

        EOSLIB_SERIALIZE(ubalance, (id)(contract)(quantity))
    };


    typedef eosio::multi_index<"ubalance"_n, ubalance,
    
      eosio::indexed_by< "byconsym"_n, eosio::const_mem_fun<ubalance, uint128_t, &ubalance::byconsym>>
    
    > ubalances_index;



/*!
   \brief Структура партнёров и их партнёров.
*/

    struct [[eosio::table, eosio::contract("secret")]] products {
        uint64_t id;
        eosio::name host;
        
        uint64_t referral_percent;
        uint64_t core_cashback_percent;
        std::string title;
        std::string description;
        std::string encrypted_data;
        eosio::name token_contract;
        eosio::asset price;
        eosio::asset referral_amount;
        eosio::asset core_amount;
        eosio::asset total;

        eosio::asset total_solded_amount;
        uint64_t total_solded_count;

        eosio::asset total_refs_amount;
        eosio::asset total_host_amount;
        eosio::asset total_core_amount;


        std::string meta;
        
        uint64_t primary_key() const{return id;}
        uint64_t bycreator() const{return host.value;}
        
        
        EOSLIB_SERIALIZE(products, (id)(host)(referral_percent)(core_cashback_percent)(title)(description)(encrypted_data)(token_contract)(price)(referral_amount)(core_amount)(total)(total_solded_amount)(total_solded_count)(total_refs_amount)(total_host_amount)(total_core_amount)(meta))


    };
      
    typedef eosio::multi_index<"products"_n, products,
      eosio::indexed_by<"bycreator"_n, eosio::const_mem_fun<products, uint64_t, &products::bycreator>>
    > products_index;




    struct [[eosio::table, eosio::contract("secret")]] flows {
        uint64_t id;

        eosio::name host;
        uint64_t product_id;
        
        eosio::time_point_sec start_at;
        eosio::time_point_sec closed_at;

        std::string encrypted_data;
        
        uint64_t participants;
        eosio::asset total;
        std::string meta;
        
        uint64_t primary_key() const {return id;}
        
        uint64_t byproductid() const {return product_id;}

        uint64_t bystartat() const {return start_at.sec_since_epoch();}
        
        EOSLIB_SERIALIZE(flows, (id)(host)(product_id)(start_at)(closed_at)(encrypted_data)(participants)(total)(meta))


    };
      
    typedef eosio::multi_index<"flows"_n, flows,
      eosio::indexed_by<"byproductid"_n, eosio::const_mem_fun<flows, uint64_t, &flows::byproductid>>,
      eosio::indexed_by<"bystartat"_n, eosio::const_mem_fun<flows, uint64_t, &flows::bystartat>>
    > flows_index;






/*!
   \brief Структура полученных реферальных балансов от партнёров на партнёра.
*/
    struct [[eosio::table, eosio::contract("secret")]] myproducts {
        uint64_t id;
        eosio::name host;
        eosio::name username;
        uint64_t product_id;
        uint64_t flow_id;
        eosio::asset total;


        std::string encrypted_data;
        eosio::time_point_sec expired_at;

        std::string meta;

        uint64_t primary_key() const {return id;}
        uint64_t byusername() const {return username.value;}
        uint64_t byflowid() const {return flow_id;}

        uint128_t byuserprod() const {return combine_ids(username.value, product_id);}

        uint128_t byuserflow() const {return combine_ids(username.value, flow_id);}

        EOSLIB_SERIALIZE(myproducts, (id)(host)(username)(product_id)(flow_id)(total)(encrypted_data)(expired_at)(meta))
    };


    typedef eosio::multi_index<"myproducts"_n, myproducts,
      eosio::indexed_by<"byusername"_n, eosio::const_mem_fun<myproducts, uint64_t, &myproducts::byusername>>,
      eosio::indexed_by<"byflowid"_n, eosio::const_mem_fun<myproducts, uint64_t, &myproducts::byflowid>>,
      eosio::indexed_by< "byuserprod"_n, eosio::const_mem_fun<myproducts, uint128_t, &myproducts::byuserprod>>,
      eosio::indexed_by< "byuserflow"_n, eosio::const_mem_fun<myproducts, uint128_t, &myproducts::byuserflow>>
    > myproducts_index;


