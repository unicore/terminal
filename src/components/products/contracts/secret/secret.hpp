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
  

    [[eosio::action]] void createprod(name host, uint64_t referral_percent, std::string title, std::string description, std::string encrypted_data, eosio::name token_contract, asset price);
    [[eosio::action]] void editprod(eosio::name host, uint64_t referral_percent, uint64_t product_id, std::string title, std::string description, std::string encrypted_data, asset price);
    [[eosio::action]] void derivesecret(eosio::name host, uint64_t user_product_id, std::string encrypted_data);

    [[eosio::action]] void buysecret(eosio::name buyer, eosio::name host, uint64_t flow_id, std::string meta);
    [[eosio::action]] void addflow(name host, uint64_t product_id, eosio::time_point_sec start_at, eosio::time_point_sec closed_at, std::string encrypted_data, std::string meta);        

    /**
    * @ingroup public_consts 
    * @{ 
    */
    static constexpr eosio::name _me = "secret"_n;   
    /**
    * @}
    */
    
};


  static uint128_t combine_ids(const uint64_t &x, const uint64_t &y) {
      return (uint128_t{x} << 64) | y;
  };

/*!
   \brief Структура партнёров и их партнёров.
*/

    struct [[eosio::table, eosio::contract("secret")]] products {
        uint64_t id;
        eosio::name host;
        
        uint64_t referral_percent;

        std::string title;
        std::string description;
        std::string encrypted_data;
        eosio::name token_contract;
        eosio::asset price;
        eosio::asset referral_amount;
        eosio::asset total;

        eosio::asset total_solded_amount;
        uint64_t total_solded_count;
        std::string meta;
        
        uint64_t primary_key() const{return id;}
        uint64_t bycreator() const{return host.value;}
        
        
        EOSLIB_SERIALIZE(products, (id)(host)(referral_percent)(title)(description)(encrypted_data)(token_contract)(price)(referral_amount)(total)(total_solded_amount)(total_solded_count)(meta))


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


