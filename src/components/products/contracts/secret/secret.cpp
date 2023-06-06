
#include "secret.hpp"

/**
\defgroup public_consts CONSTS
\brief Константы контракта
*/

/**
\defgroup public_actions ACTIONS
\brief Методы действий контракта
*/

/**
\defgroup public_tables TABLES
\brief Структуры таблиц контракта
*/



[[eosio::action]] void secret::addflow(name host, uint64_t product_id, eosio::time_point_sec start_at, eosio::time_point_sec closed_at, std::string encrypted_data, std::string meta) {

  require_auth(host);

  products_index products(_me, host.value);

  
  auto product = products.find(product_id);
  eosio::check(product != products.end(), "Product is not found");

  flows_index flows(_me, host.value);
  
  flows.emplace(_me, [&](auto &f){
    f.id = flows.available_primary_key();
    f.host = host;
    f.product_id = product_id;
    f.start_at = start_at;
    f.closed_at = closed_at;
    f.encrypted_data = encrypted_data;
    f.meta = meta;
    f.total = asset(0, product -> total.symbol);
  });

}



[[eosio::action]] void secret::createprod(name host, uint64_t referral_percent, std::string title, std::string description, std::string encrypted_data, eosio::name token_contract, asset price) {

  require_auth(host);

  products_index products(_me, host.value);

  eosio::check(referral_percent <= HUNDR_PERCENT, "Ref percent cannot be more then 100%");
  
  //token_contract should equal root_token_contract in core

  products.emplace(_me, [&](auto &p){
    p.id = products.available_primary_key(); 
    p.host = host;
    p.title = title;
    p.description = description;
    p.referral_percent = referral_percent;
    p.price = price;
    p.referral_amount = price * referral_percent / HUNDR_PERCENT;
    p.token_contract = token_contract;
    p.total = price  + price * referral_percent / HUNDR_PERCENT;
    p.total_solded_amount = asset(0, price.symbol);
    p.total_solded_count = 0;
  });

}



[[eosio::action]] void secret::editprod(eosio::name host, uint64_t referral_percent, uint64_t product_id, std::string title, std::string description, std::string encrypted_data, asset price) {


  require_auth(host);

  products_index products(_me, host.value);

  auto product = products.find(product_id);
  eosio::check(product != products.end(), "Product is not found");


  products.modify(product, _me, [&](auto &p){
    p.title = title;
    p.description = description;
    p.encrypted_data = encrypted_data;
    p.price = price;
    p.referral_percent = referral_percent;
    p.price = price;
    p.referral_amount = price * referral_percent / HUNDR_PERCENT;
    p.total = price  + price * referral_percent / HUNDR_PERCENT;
  });
}




[[eosio::action]] void secret::buysecret(eosio::name buyer, eosio::name host, uint64_t flow_id, std::string meta) {

  require_auth(buyer);
 
  flows_index flows(_me, host.value);
  auto flow = flows.find(flow_id);
  

  products_index products(_me, host.value); 
  auto product = products.find(flow -> product_id);
  eosio::check(product != products.end(), "Product is not found");

  eosio::asset amount = product -> price;
  eosio::asset ref_amount = product -> referral_amount;
  eosio::asset total = product -> total;
  
  eosio::check(amount + ref_amount == total, "Prices and amounts is not equal");

  flows.modify(flow, buyer, [&](auto &f){
    f.total += total;
    f.participants += 1;
  });

  products.modify(product, buyer, [&](auto &p){
    p.total_solded_amount += total;
    p.total_solded_count += 1;
  });

  myproducts_index myproducts(_me, host.value); 
  auto myproducts_by_host_index = myproducts.template get_index<"byuserprod"_n>();

  auto myproducts_ids = combine_ids(buyer.value, flow -> product_id);
  auto myproduct = myproducts_by_host_index.find(myproducts_ids);
  
  uint64_t user_product_id = myproducts.available_primary_key();

  myproducts.emplace(buyer, [&](auto &p){
      p.id = user_product_id;
      p.host = host;
      p.username = buyer;
      p.product_id = product -> id;
      p.flow_id = flow_id;
      p.total = total;
      p.meta = meta;
    });

  print(buyer, _me, host, product -> token_contract, total, ref_amount);
  action(
      permission_level{ _me, "active"_n },
      "unicore"_n, "payvirtual"_n,
      std::make_tuple( buyer, _me, host, product -> token_contract, total, ref_amount)
  ).send();

  
// (eosio::name username, eosio::name from, eosio::name host, eosio::name contract, eosio::asset total, eosio::asset spread_to_refs){

}



[[eosio::action]] void secret::derivesecret(eosio::name host, uint64_t user_product_id, std::string encrypted_data) {
  require_auth(host); 

  myproducts_index myproducts(_me, host.value); 
  
  auto myproduct = myproducts.find(user_product_id);

  myproducts.modify(myproduct, host, [&](auto &p){
    p.encrypted_data = encrypted_data;
  });
  
}



extern "C" {
   void apply( uint64_t receiver, uint64_t code, uint64_t action ) {
        if (code == secret::_me.value) {
          
          switch (action) {

              EOSIO_DISPATCH_HELPER(secret, 
                  (createprod)(editprod)(addflow)(buysecret)(derivesecret)
              )
           
            }

        } else {

          if (action == "transfer"_n.value){
            
            struct transfer{
                eosio::name from;
                eosio::name to;
                eosio::asset quantity;
                std::string memo;
            };

            auto op = eosio::unpack_action_data<transfer>();

            if (op.to == secret::_me) {
              //DISPATCHER FOR INCOME TRANSFERS 
            }
          }
        }
  };
};
