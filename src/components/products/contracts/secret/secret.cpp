
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



[[eosio::action]] void secret::createprod(name host, uint64_t referral_percent, uint64_t core_cashback_percent, std::string title, std::string description, std::string encrypted_data, eosio::name token_contract, asset price) {

  require_auth(host);

  products_index products(_me, host.value);
  
  products.emplace(_me, [&](auto &p){
    p.id = products.available_primary_key(); 
    p.host = host;
    p.title = title;
    p.description = description;
    p.referral_percent = referral_percent;
    p.core_cashback_percent = core_cashback_percent;
    p.price = price;
    p.referral_amount = price * referral_percent / HUNDR_PERCENT;
    p.core_amount = price * core_cashback_percent / HUNDR_PERCENT;
    p.token_contract = token_contract;
    p.total = price  + price * referral_percent / HUNDR_PERCENT + price * core_cashback_percent / HUNDR_PERCENT;
    p.total_solded_amount = asset(0, price.symbol);
    p.total_solded_count = 0;


    p.total_host_amount = asset(0, price.symbol);
    p.total_refs_amount = asset(0, price.symbol);
    p.total_core_amount = asset(0, price.symbol);

  });

}





[[eosio::action]] void secret::editprod(eosio::name host, uint64_t referral_percent, uint64_t core_cashback_percent, uint64_t product_id, std::string title, std::string description, std::string encrypted_data, asset price) {


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
    p.core_cashback_percent = core_cashback_percent;
    p.price = price;
    p.referral_amount = price * referral_percent / HUNDR_PERCENT;
    p.core_amount = price * core_cashback_percent / HUNDR_PERCENT;
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
  eosio::asset core_amount = product -> core_amount;
  eosio::asset total = product -> total;
  
  eosio::check(amount + ref_amount + core_amount == total, "Prices and amounts is not equal");

  flows.modify(flow, buyer, [&](auto &f){
    f.total += total;
    f.participants += 1;
  });

  products.modify(product, buyer, [&](auto &p){
    p.total_solded_amount += total;
    p.total_solded_count += 1;

    p.total_host_amount += product -> price;
    p.total_refs_amount += ref_amount;
    p.total_core_amount += core_amount;

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


  sub_balance(buyer, total, product -> token_contract);

  action(
        permission_level{ _me, "active"_n },
        product -> token_contract, "transfer"_n,
        std::make_tuple( _me, _unicore, ref_amount, std::string("111-" + (name{host}.to_string()) + "-" + (name{buyer}.to_string()))) 
    ).send();

  action(
        permission_level{ _me, "active"_n },
        product -> token_contract, "transfer"_n,
        std::make_tuple( _me, _unicore, core_amount, std::string("800-" + (name{host}.to_string()))) 
    ).send();


  add_balance(host, product->price, product -> token_contract);

}



[[eosio::action]] void secret::derivesecret(eosio::name host, uint64_t user_product_id, std::string encrypted_data) {
  require_auth(host); 

  myproducts_index myproducts(_me, host.value); 
  
  auto myproduct = myproducts.find(user_product_id);

  myproducts.modify(myproduct, host, [&](auto &p){
    p.encrypted_data = encrypted_data;
  });
  
}


[[eosio::action]] void secret::withdraw(eosio::name host, uint64_t balance_id) {
  require_auth(host);

  ubalances_index ubalances(_me, host.value);
  auto balance = ubalances.find(balance_id);

  eosio::check(balance != ubalances.end(), "Balance is not found");

  action(
      permission_level{ _me, "active"_n },
      balance -> contract, "transfer"_n,
      std::make_tuple( _me, host, balance -> quantity, std::string("111-")) 
  ).send();

  ubalances.erase(balance);

}

void secret::add_balance(eosio::name payer, eosio::asset quantity, eosio::name contract) {
    require_auth(payer);

    ubalances_index ubalances(_me, payer.value);
    
    auto balances_by_contract_and_symbol = ubalances.template get_index<"byconsym"_n>();
    auto contract_and_symbol_index = combine_ids(contract.value, quantity.symbol.code().raw());

    auto balance = balances_by_contract_and_symbol.find(contract_and_symbol_index);

    if (balance  == balances_by_contract_and_symbol.end()){
      ubalances.emplace(_me, [&](auto &b) {
        b.id = ubalances.available_primary_key();
        b.contract = contract;
        b.quantity = quantity;
      }); 
    } else {
      balances_by_contract_and_symbol.modify(balance, _me, [&](auto &b) {
        b.quantity += quantity;
      });
    };
  
}



void secret::sub_balance(eosio::name username, eosio::asset quantity, eosio::name contract) {
    ubalances_index ubalances(_me, username.value);
    
    auto balances_by_contract_and_symbol = ubalances.template get_index<"byconsym"_n>();
    auto contract_and_symbol_index = combine_ids(contract.value, quantity.symbol.code().raw());

    auto balance = balances_by_contract_and_symbol.find(contract_and_symbol_index);
    
    eosio::check(balance != balances_by_contract_and_symbol.end(), "Balance is not found");
    
    eosio::check(balance -> quantity >= quantity, "Not enought user balance for create order");

    if (balance -> quantity == quantity) {

      balances_by_contract_and_symbol.erase(balance);

    } else {

      balances_by_contract_and_symbol.modify(balance, _me, [&](auto &b) {
        b.quantity -= quantity;
      });  

    }
    
}




extern "C" {
   void apply( uint64_t receiver, uint64_t code, uint64_t action ) {
        if (code == secret::_me.value) {
          
          switch (action) {

              EOSIO_DISPATCH_HELPER(secret, 
                  (createprod)(editprod)(addflow)(buysecret)(derivesecret)(withdraw)
              )
           
            }

        } else {

          if (action == "transfer"_n.value){
            
            struct transfer {
                eosio::name from;
                eosio::name to;
                eosio::asset quantity;
                std::string memo;
            };

            auto op = eosio::unpack_action_data<transfer>();

            if (op.to == secret::_me) {
              secret::add_balance(op.from, op.quantity, eosio::name(code)); 
            }
          }
        }
  };
};
