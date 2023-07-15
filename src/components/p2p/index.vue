<template lang="pug">
div.row
  
  // p2pTour(v-if="isEducation")
  
  div(v-if="showList").col-12
    div
      
      chooseOrder(id="getParentOrders" :btc_rate="Number(usd_rate)" :type="'buy'" :out_token="out_token" :orders="sell_orders" :root_contract="root_token.contract" :quote_token="quote_token" :root_symbol="root_token.symbol" :root_token="root_token" :quote_symbol="'USD'" :out_currency="out_token.symbol" :bonus_rate="bonus_rate")
      
  div(v-else).col-12
    div.row.justify-center.q-mt-md
      div.col-md-6.col-sm-8.col-xs-12
        q-card( id="p2pUSDrate" style="border: 1px solid grey; margin-bottom: 0px !important; padding-bottom: 0px !important;").text-center.q-ma-md.q-pa-sm
          div
            q-input(square readonly borderless label="Рекомендуемый курс" v-model="bonus_rate" )
              template(v-slot:append)
                span(style="font-size: 16px;") {{bonus_symbol}}

          div
            q-input(square readonly borderless label="Стоимость вашего аккаунта" v-model="coreUsdTokenBalance" )
              template(v-slot:append)
                span(style="font-size: 16px;") {{out_token.symbol}}
              
        // div().text-right.text-grey
        //   q-btn( flat size="sm" dense @click="startEducation").q-ml-sm.q-mr-md как это работает?
    
      
    div(style="align-items: end;").q-mt-lg.row.justify-around
      // UNCOMMENT IT
      div().col-md-4.col-sm-6.col-xs-12
        //BUY
        
        // p(style="margin-bottom: 0px;").text-center.text-grey-6 хотят купить
        q-list(id="giveHelp" separator ).q-ma-md
          div.text-center
            span(v-if="!loggedIn").text-grey для оказания помощи сперва зарегистрируйтесь
            q-btn(:disable="!loggedIn" id="giveHelpButton" color="teal" @click="provideHelp" size="lg").full-width Оказать помощь
            span.text-grey и получить {{root_token.symbol}}
            //depositDialog('buy')
          // chooseOrder(id="giveParentOrders" :btc_rate="usd_rate" :type="'sell'" :out_token="out_token"  :orders="buy_orders" :root_contract="root_token.contract" :quote_token="quote_token" :root_symbol="root_token.symbol" :root_token="root_token"  :quote_symbol="'USD'" :out_currency="out_token.symbol" :bonus_rate="bonus_rate")
    

      div().col-md-4.col-sm-6.col-xs-12
        // p test
        //SELL
        // p(style="margin-bottom: 0px;").text-center.text-grey-6 хотят продать
        q-list(id="getHelp" separator ).q-ma-md 
          //style="border: 2px solid red;"
          div.text-center
            span(v-if="coreTokenBalance == 0").text-grey для получения помощи сперва окажите её
            q-btn(:disable="coreTokenBalance == 0 || !loggedIn" id="getHelpButton" color="red" @click="depositDialog('sell')" size="lg").full-width Запросить помощь
            span.text-grey и получить {{out_token.symbol}}
        
    // div(v-if="!loggedIn").q-mt-lg.row.justify-center
    //   q-card(bordered).bg-grey-2.col-md-4.col-sm-6.col-xs-12.q-pa-md
    //     q-btn(v-if="!registerProcess" @click="registerProcess = true" style="font-size:18px;" outline).full-width Регистрация
    //     AuthForm(v-if="registerProcess")      
          
    div.row.justify-between.q-mt-lg  
      //заявки
      div.col-md-8.col-xs-12
        div(v-if="(to_orders.length > 0)")
          p(style="margin-bottom: 0px;").text-center.text-grey-6 мои входящие поручения
          q-list( v-if="(to_orders.length > 0)" separator).q-ma-md
            incomeOrders(:btc_rate="Number(usd_rate)" :orders="to_orders" :out_token="out_token"  :root_contract="root_token.contract" :root_symbol="root_token.symbol" :quote_token="quote_token" :root_token="root_token"  :quote_symbol="'USD'" :out_currency="out_token.symbol")

      //мои ордера
      div.col-md-4.col-xs-12
        div(v-if="(my_orders.length > 0)")
          p(style="margin-bottom: 0px;").text-center.text-grey-6 мои заявки на получение помощи
          q-list(separator).q-ma-md
            myOrders(:btc_rate="Number(usd_rate)" :orders="my_orders" :out_token="out_token" :root_contract="root_token.contract" :quote_token="quote_token" :root_symbol="root_token.symbol" :root_token="root_token"  :quote_symbol="'USD'" :out_currency="out_token.symbol")
   
    // div.row
    //   AccountEvents(v-if="config.tableCodeConfig.p2p" :username="config.tableCodeConfig.p2p").full-width

  q-dialog(v-model="dialog" persistent transition-show="slide-up" transition-hide="slide-down")

    q-card.full-width
      q-bar
        span(style="font-size: 14px;") создать заявку на получение помощи 
        q-space
        q-btn(unelevated dense flat icon="close" v-close-popup)
          q-tooltip Закрыть

      div.row.text-center.justify-center
        div.col-md-12.col-xs-12
          
          q-select(v-if="!out_token.symbol" options-dense dense  label="Выберите валюту" label-color="white" v-model="out_token" :options="out_tokens" option-value="symbol" option-label="symbol").q-pa-md.full-width
            template(v-slot:append)
              span(style="font-size: 16px;") {{out_token.symbol}}
          template(v-if="out_token.symbol")
            div
              //установка курса
              div(v-if="step == 1")
                div(style="margin-top: 10px;").q-pt-lg.q-pb-lg
                  
                  div(style="margin: auto;").row.justify-center.q-ml-md.q-mr-md
                    q-slider(
                      track-size="20px"
                      thumb-size="30px"
                      label-always
                      color="teal"
                      thumb-color="teal"
                      v-model="current_brate"
                      :min=0
                      :max="parseFloat(bonus_rate) * 2"
                      :step="0.05"
                      :label-value="current_brate + ' USDT / ' + root_token.symbol"
                    ).col-8
                  
                  div.row.justify-between


                    div.col-4
                      q-btn(flat size="sm" @click="faster").text-grey быстрее и убыточнее

                    
                    div.col-4
                      q-btn(flat size="sm" @click="normal").text-grey нормальный курс
                    

                    div.col-4
                      q-btn(flat size="sm" @click="slower").text-grey медленнее и выгоднее

                // q-input(filled type="number" :label="'Установите курс обмена ' + root_token.symbol" v-model="brate"  controls-position="right" :precision="4" :step="0.05" :min="0")
                //   template(v-slot:append)
                //     span(style="font-size: 16px;") USDT
                // p {{usd_rate}}
                
                        

            div(v-if="step == 2")  
              div(style="align-items: center;").bg-grey-4.row.full-width.justify-around
                div.col-2
                  q-btn(flat size="sm" @click="set10").full-width 10%
                
                // q-slider(
                //   v-if="orderType=='sell'"
                //   track-size="24px"
                //   thumb-size="35px"
                //   color="teal"
                //   v-model="root_quantity"
                //   :min=0
                //   :max="floatTokenBalance"
                //   :step='0.0001'
                //   :label-value="'отдаю: ' + parseFloat(root_quantity || 0).toFixed(root_token.precision) + ' ' + root_token.symbol"
                // ).col-8
              
                //   q-badge(color="secondary") {{ root_quantity }} 
                
                // q-slider(
                //   v-if="orderType=='buy'"
                  
                //   track-size="24px"
                //   thumb-size="35px"
                     
                //   color="teal"
                //   v-model="root_quantity"
                //   :min=0
                //   :step='0.0001'
                //   :max="100000"
                //   :label-value="'получаю: ' + parseFloat(root_quantity || 0).toFixed(root_token.precision) + ' ' + root_token.symbol"
                // ).col-8
              
                  q-badge(color="secondary") {{ root_quantity }} 
              
                
                div.col-2
                  q-btn(flat size="sm" @click="set25").full-width 25%
                
                div.col-2
                  q-btn(flat size="sm" @click="set50").full-width 50%
                
                div.col-2
                  q-btn(flat size="sm" @click="set75").full-width 75%
                
                div.col-2
                  q-btn(flat size="sm" @click="set100").full-width 100%
               

              q-input(filled type="number" :label="'Получаю ' +  out_token.symbol" v-model="out_quantity"  controls-position="right" :precision="4" :step="0.0001" :min="0")
                template(v-slot:append)
                  span(style="font-size: 16px;") {{out_token.symbol}}
              

              q-input(filled type="number" :label="'Отдаю ' + root_token.symbol " v-model="root_quantity"  controls-position="right" :precision="4" :step="0.0001" :min="0")
                template(v-slot:append)
                  span(style="font-size: 16px;") {{root_token.symbol}}
              
              
              q-input(filled type="number" label="По курсу" v-model="current_brate" readonly controls-position="right" :precision="4" :step="0.0100" :min="0")
                template(v-slot:append)
                  span(style="font-size: 16px;") {{out_token.symbol + ' /'}} {{root_token.symbol}}  
                  
            div(v-if="step==3")
              q-input(v-if="orderType=='sell'" filled :label="details_caption" v-model="details.address" autogrow)
            
          

        
      div.row.text-center
        q-btn(v-if="step > 1" color="red" flat @click="step=step - 1"  size="sm").col-6 назад
        q-btn(v-if="step == 1" color="red" flat @click="cancelSubmit"  size="sm").col-6 отменить
        q-btn(v-if="out_token.symbol && step == 3" color="teal" @click="create").col-6 создать заявку
        q-btn(v-if="out_token.symbol && step < 3" color="teal" @click="step=step+1").col-6 продолжить

</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch, onUnmounted} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useWalletStore } from '~/stores/wallet'
import { useP2PStore } from './store/index'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import AuthForm from '~/components/user/AuthForm.vue'
import AccountEvents from '~/components/explorer/AccountEvents.vue'


import { LocalStorage } from 'quasar'

import chooseOrder from './chooseOrder.vue';
import myOrders from './myOrders.vue';
import incomeOrders from './incomeOrders.vue';
// import p2pTour from '@/components/tours/p2pTour';

import { Notify } from 'quasar'

const dialog = ref(false);
const orderType = ref('buy');
const orderOnSubmit = ref(null);
const root_tokens = ref([{contract: "eosio.token", symbol: config.chains[0].coreSymbol, precision: 4}]);
const root_token = ref({});
const quote_tokens = ref([{contract: "", symbol: "USD", precision: 4}]);
const quote_token = ref({contract: "", symbol: "USD", precision: 4});
const out_token = ref({symbol: null, precision: 4, contract: ""});
const details = ref({type: '', address: ""});
const root_quantity = ref(0);
const out_quantity = ref(0);
const refresh_id = ref(null);
const refresh_id2 = ref(null);
const refresh_id3 = ref(null);
const step = ref(1)
const registerProcess = ref(false)

const faster = () => {
  if (parseFloat((current_brate.value) - 0.05) > 0 )
    current_brate.value = Number(parseFloat((current_brate.value) - 0.05).toFixed(4))
}

const normal = () => {
  current_brate.value = parseFloat(bonus_rate.value)
}

const slower = () => {
  
  current_brate.value = Number(parseFloat((current_brate.value) + 0.05).toFixed(4))
}

const set10 = () => {
  root_quantity.value = floatTokenBalance.value * 0.1
}


const set25 = () => {
  root_quantity.value = floatTokenBalance.value * 0.25
}


const set50 = () => {
  root_quantity.value = floatTokenBalance.value * 0.5
}


const set75 = () => {
  root_quantity.value = floatTokenBalance.value * 0.75
}


const set100 = () => {
  root_quantity.value = floatTokenBalance.value
}
const current_brate = ref(0);
const brate = ref(0);

import chains from '~/chainsMain'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

const walletStore = useWalletStore()

const p2pStore = useP2PStore()

  onMounted(async () => {

    if (root_token.value && root_tokens.value.length > 0)
      root_token.value = root_tokens.value[0]

    p2pStore.get_orders()

    if (userStore.username){
      p2pStore.getUserStat(userStore.username, config.chains[0].coreSymbol, "eosio.token")
    }

    p2pStore.get_usdrates().then(res => {

      brate.value = Number(parseFloat(bonus_rate.value))
    })

    refresh_id.value = setInterval(function() { 
      p2pStore.get_orders()
    }, 5000); //30000


    
    refresh_id2.value = setInterval(function(){ 
      p2pStore.get_usdrates()
    }, 1000);


    refresh_id3.value = setInterval(function() { 
      userStore.getUserBalances()
    }, 5000); //30000

  })


  onUnmounted(async() => {
      clearInterval(refresh_id.value)
      clearInterval(refresh_id2.value)
      clearInterval(refresh_id3.value)
  })


  const startEducation = () => {

  }

  const cancelSubmit = (order) => {
      dialog.value = false
      orderOnSubmit.value = null
  }

  const provideHelp = () => {
    router.push({name: "provide-help"})
  }

  const cancelProvideHelp = () => {
   router.push({name: "p2p"}) 
  }

  const setMin = () => {

  }

  const setMax = () => {
    
  }

  const create = () => {
    
      if (details.value.address == "" && orderType.value == "sell"){
        Notify.create({
            message: 'Установите детали платежа',
            color: 'orange', //'negative' 'teal'
            classes: 'notify-class',
        })

        if (floatTokenBalance.value == 0 )
          Notify.create({
            message: 'Недостаточный баланс',
            color: 'orange', //'negative' 'teal'
            classes: 'notify-class',
        })

        return
        
      } 
      details.value.type = out_token.value.symbol

      // if ( this.orderType == "sell") {
        
      //   this.$q.localStorage.set(this.details.type, this.details.address)

      // }
        

      if (root_quantity.value <= 0) {
        Notify.create({
            message: 'Установите количество единиц',
            color: 'orange', //'negative' 'teal'
            classes: 'notify-class',
        })
        return
      }

      let data = {
        username: userStore.username,
        parent_id: 0,
        type: orderType.value,
        root_contract: root_token.value.contract,
        root_quantity: parseFloat(root_quantity.value).toFixed(root_token.value.precision) + " " + root_token.value.symbol,
        
        quote_type: "external",

        quote_rate: quote_rate.value,
        quote_contract: "",
        quote_quantity: quote_quantity.value,
        
        out_type: "crypto",
        out_rate: 0,
        out_contract: "",
        out_quantity: parseFloat(0).toFixed(out_token.value.precision) + ' ' + (out_token.value.symbol),
        // details: ""

        details: JSON.stringify(details.value)
      }
      
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
      
      if (orderType.value == "sell"){
        
        let transferData = {
          from: data.username,
          to: config.tableCodeConfig.p2p,
          quantity: data.root_quantity,
          memo: ''
        }

      
        api.transact({ 
          actions: [{
            account: data.root_contract,
            name: 'transfer',
            authorization: [{
              actor: userStore.username,
              permission: 'active',
            }],
            data: transferData,
          },
          {
            account: config.tableCodeConfig.p2p,
            name: 'createorder',
            authorization: [{
              actor: userStore.username,
              permission: 'active',
            }],
            data,
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        }).then(res => {
          p2pStore.get_orders()
          dialog.value = false
          root_quantity.value = 0
          userStore.getUserBalances()
        }).catch(e => {
           Notify.create({
              message: e.message,
              color: 'negative', //'negative' 'teal'
              classes: 'notify-class',
          })
        })

      } else if (orderType.value == "buy") {
          
          api.transact({ 
            actions: [
            {
              account: config.tableCodeConfig.p2p,
              name: 'createorder',
              authorization: [{
                actor: userStore.username,
                permission: 'active',
              }],
              data,
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          }).then(res => {

            p2pStore.get_orders()
            dialog.value = false
            root_quantity.value = 0
            userStore.getUserBalances()
          }).catch(e => {
             Notify.create({
                message: e.message,
                color: 'negative', //'negative' 'teal'
                classes: 'notify-class',
            })
          })

      }

    
  }



const depositDialog = (type) => {
   root_quantity.value = 0
   out_quantity.value = 0

   orderType.value = type
   dialog.value = true

   current_brate.value = brate.value
}


const showList = computed(() => {
  return router.currentRoute.value.name == 'provide-help'
})


  const loggedIn = computed(() => {
    return userStore.hasAuth
  })

const out_tokens = computed(() => {
      var out_tokens = []

      if (Object.values(p2pStore.usdrates).length > 0){
        Object.values(p2pStore.usdrates).map(el => {

          const [amountString, symbol] = el.out_asset.split(" ")
          const [leftSide, rightSide] = amountString.split("0.")
          const precision = rightSide.length

          let need_filter = config.p2p.filter_curr_on_p2p

           // && 

          if (symbol != config.chains[0].coreSymbol && (need_filter ? !config.filter_curr_on_p2p.find(el => el == symbol) : true)){
            out_tokens.push({
              symbol: symbol,
              precision: precision,
              contract: el.out_contract
            })  
          }
        
        })
        return out_tokens
      } else 
      return []

})

const quote_rate = computed({
    get: () => {
      if (current_brate.value) {
        return parseFloat(current_brate.value);
      } else {
        return 0;
      }
    },
    set: (value) => {
      brate.value = Number(value);
    },
  });

const bonus_symbol = computed(() => {
  return ' USDT / ' + config.chains[0].coreSymbol
})

const accountBlockedTokens = computed(() => {
  return p2pStore.userTokenStats[config.chains[0].coreSymbol] ? p2pStore.userTokenStats[config.chains[0].coreSymbol].blocked_now : parseFloat(0) + " " + config.chains[0].coreSymbol
})

const accountCost = computed(() => {
  return parseFloat(coreTokenBalance.value) + parseFloat(accountBlockedTokens.value)
})

const bonus_rate = computed(() => {
      let p = parseFloat(0).toFixed(4) + ' ' + config.chains[0].coreSymbol
      
      let r = Object.values(p2pStore.usdrates).find(el => el.out_asset == p)
      
      if (r) 
        return parseFloat(r.rate).toFixed(16)
       
      else return null

})

const isEducation = computed(() => {

    return p2pStore.isEducation

})


const coreTokenBalance = computed(() => {
  return parseFloat(userStore.userBalancesSafe[config.chains[0].coreSymbol]) || 0
});

const coreUsdTokenBalance = computed(() => {
  return accountCost.value * parseFloat(bonus_rate.value)
})

const tokenBalance = computed(() => {
    if (root_token.value.symbol){


      let bal = userStore.userBalancesSafe[root_token.value.symbol]
      
      if (bal) return bal
        else return parseFloat(0).toFixed(4) || 0 + ' ' + root_token.value.symbol
  }  else return 0
})


const floatTokenBalance = computed(() => {
  if (tokenBalance.value)
    return parseFloat(tokenBalance.value)
  else return 0
})

const details_caption = computed(() => {
      if (root_token.value.symbol == "BTC")
        return "Введите адрес BTC-кошелька"
      else return "Введите адрес для получения USDT в сети TRON (TRC20)"
})

const usd_rate = computed(() => {
      
    if (out_token.value){
      let p = parseFloat(0).toFixed(out_token.value.precision) + ' ' + out_token.value.symbol

      let r = Object.values(p2pStore.usdrates).find(el => el.out_contract == out_token.value.contract && el.out_asset == p)
    
      if (r) return parseFloat(r.rate).toFixed(out_token.value.precision)
        else return 0  
    }
      
  })  


const quote_quantity = computed(() => {
  return quote.value + " " + quote_token.value.symbol
})

const quote = computed(() => {
    
  return (root_quantity.value * quote_rate.value).toFixed(quote_token.value.precision)
})




const getLabel = computed(() => {
    if (orderType.value == "buy")
      return "Отдадите"
    else return "Получите"
})


const btc_quantity = computed(() => (root_quantity.value * quote_rate.value / usd_rate.value).toFixed(out_token.precision.value));
const orders = computed(() => Object.values(p2pStore.orders))
//computed(() => userStore.username ? Object.values(p2pStore.orders).filter(el => el.creator == userStore.username) : Object.values(p2pStore.orders));

const buy_orders = computed(() => orders.value.filter(el => el.type == "buy" && el.parent_id == 0 && el.status != "finish"  && parseFloat(el.root_remain) > 0 ));

const sell_orders = computed(() => orders.value.filter(el => el.type == "sell" && el.parent_id == 0  && el.status != "finish" && parseFloat(el.root_remain) > 0 ));

const my_orders = computed(() => orders.value.filter(el => el.creator == userStore.username && el.parent_id == 0));

const to_orders = computed(() => {
    let to_orders = [];
    let to_filtered = orders.value;
    
    to_filtered.map(order => {
        let or1 = orders.value.find(el => el.id == order.parent_id);
        if (or1) {
            if (or1.creator == userStore.username || order.creator == userStore.username)
                to_orders.push(order);
        }
    });

    return to_orders;
});    

watch(current_brate, (newValue, oldValue) => {
  root_quantity.value = 0
})

watch(bonus_rate, (newValue, oldValue) => {
    if (newValue != oldValue) {
        brate.value = Number(parseFloat(newValue));
    }
});

watch(out_tokens, (newValue) => {
  if (newValue.length == 1){
    
    out_token.value = newValue[0]
  }
})

watch(out_quantity, (newValue, oldValue) => {
    if (newValue != oldValue) {
        root_quantity.value = newValue * usd_rate.value / quote_rate.value;
        root_quantity.value = parseFloat(root_quantity.value);
        if (root_quantity.value > floatTokenBalance.value && orderType.value === "sell") {
           
            Notify.create({
                message: 'Недостаточный баланс',
                color: 'orange',
                classes: 'notify-class',
            });

            root_quantity.value = floatTokenBalance.value;
        }
    }
});

watch(dialog, (newValue, oldValue) => {
    if (newValue === false) {
        out_token.value = JSON.parse(JSON.stringify(out_token.value));
        out_token.value.symbol = null;
    }

    step.value = 1
});

watch(root_quantity, (newValue, oldValue) => {
    if (newValue != oldValue) {
        if (newValue > floatTokenBalance.value && orderType.value === "sell") {
            root_quantity.value = floatTokenBalance.value;
            
            Notify.create({
                message: 'Недостаточный баланс',
                color: 'orange',
                classes: 'notify-class',
            });
        }

        out_quantity.value = newValue / usd_rate.value * quote_rate.value;
        out_quantity.value = out_quantity.value.toFixed(out_token.value.precision);
    }
});

// watch(brate, (newValue, oldValue) => {
    
//     if (newValue != oldValue) {
//         if (newValue > floatTokenBalance.value && orderType.value === "sell") {
//             root_quantity.value = floatTokenBalance.value;
//             Notify.create({
//                 message: 'Недостаточный баланс',
//                 color: 'orange',
//                 classes: 'notify-class',
//             });
//         }

//         out_quantity.value = newValue / usd_rate.value * quote_rate.value;
//         out_quantity.value = out_quantity.value.toFixed(out_token.value.precision);
//     }

// });



</script>
