<template lang="pug">
div
  div(bordered flat).full-width.text-center
    h2 Выберите заявку
    // p 
  
  q-table(
  square
  :grid="$q.screen.lt.sm"
  flat
  :rows="computed_orders"
  :columns="columns"
  row-key="pool_id"
  :pagination={rowsPerPage: 0}
  :no-data-label="'нет данных'"
  :visible-columns="visibleColumns"
  )

    // grid mode for mobile
    template(v-slot:item="props" v-if="$q.screen.lt.sm") 
      div.col-12
        q-card(bordered flat).q-ma-xs
          q-card-section
            div.text.text-grey Курс: 
            div.text {{ props.row.quote_rate }} 

            div.text-grey Сумма:
            div {{get_out_remain(props.row)}}

            div.text-grey(v-if="!p2pSale") Бонус:
            div(v-if="!p2pSale") {{props.row.root_remain}}

            div.text-grey(v-if="p2pSale") Всего:
            div(v-if="p2pSale") {{props.row.root_remain}}

            div.q-pt-lg
              template(v-if="!p2pSale")

                q-btn(id="getHelpInsideButton" v-if="type == 'sell' && props.row.creator != username " outline size="sm" color="red"  @click="openDialog(props.row)") Получить помощь
                q-btn(id="giveHelpInsideButton" v-if="type == 'buy'  && props.row.creator != username " outline size="sm" color="teal"  @click="openDialog(props.row)") Оказать помощь
              template(v-else)
                q-btn(v-if="type == 'sell' && props.row.creator != username " outline size="sm" color="red"  @click="openDialog(props.row)") Продать
                q-btn(v-if="type == 'buy'  && props.row.creator != username " outline size="sm" color="teal"  @click="openDialog(props.row)") Купить
              q-btn(color="red" v-if="props.row.status == 'waiting' && (props.row.creator == username || username == 'p2p')  && parseFloat(props.row.root_locked) == 0" outline size="sm" @click="cancel(props.row.id)") Отменить

    // table mode for larger screens
    template(v-slot:body="props" v-else) 
      q-tr(:props="props")
        q-td(key="quoterate")
          span {{ props.row.quote_rate }} 

        q-td(key="remain")
          span {{get_out_remain(props.row)}}

        q-td(key="bonus" v-if="!p2pSale")
          span {{props.row.root_remain}}

        q-td(key="action")
          template(v-if="!p2pSale")
            q-btn(id="getHelpInsideButton" v-if="type == 'sell' && props.row.creator != username " outline size="sm" color="red"  @click="openDialog(props.row)") Получить помощь
            q-btn(id="giveHelpInsideButton" v-if="type == 'buy'  && props.row.creator != username " outline size="sm" color="teal"  @click="openDialog(props.row)") Оказать помощь
          template(v-else)
            q-btn(v-if="type == 'sell' && props.row.creator != username " outline size="sm" color="red"  @click="openDialog(props.row)") Продать
            q-btn(v-if="type == 'buy'  && props.row.creator != username " outline size="sm" color="teal"  @click="openDialog(props.row)") Купить
          q-btn(color="red" v-if="props.row.status == 'waiting' && (props.row.creator == username || username == 'p2p')  && parseFloat(props.row.root_locked) == 0" outline size="sm" @click="cancel(props.row.id)") Отменить

                   
  q-dialog(v-model="dialog" v-if="orderOnAct" persistent :maximized="maximazed" transition-show="slide-up" transition-hide="slide-down")
    q-card.full-width
      q-bar
        span(style="font-size: 14px;") укажите сумму оказания помощи
        // на {{type == "buy" ? "оказание помощи в" : "получение помощи в"}} {{root_token.symbol}}
        q-space
        q-btn(unelevated dense flat icon="close" v-close-popup)
          q-tooltip Закрыть

      div.row.text-center.justify-center
        div.col-md-12.col-xs-12
          div
            // div.flex.full-width.text-center
            //   span курс: 
            //   q-badge() {{orderOnAct.quote_rate}}

            div(style="align-items: center;").bg-grey-4.row.justify-around
              div.col-2
                q-btn(flat size="sm" @click="set10").full-width 10%
              // div.col-8
              //   q-slider(
              //     track-size="24px"
              //     thumb-size="24px;"
              //     @change="change('root_remain_float')"
                  
              //     color="teal"
              //     v-model="root_remain_float"
              //     :min=0
              //     :max="max_root_remain_float"
              //     :step=0.0001
              //   )

            
            
              div.col-2
                q-btn(flat size="sm" @click="set25").full-width 25%
              
              div.col-2
                q-btn(flat size="sm" @click="set50").full-width 50%
              
              div.col-2
                q-btn(flat size="sm" @click="set75").full-width 75%

              div.col-2
                q-btn(flat size="sm" @click="set100").full-width 100%

            q-input( @change="change('out_remain')" filled label-color="teal" type="number" :label="getLabel" v-model="orderOnAct.out_remain"  controls-position="right" :precision="8" :step="0.0100" :min="0").full-width
              template(v-slot:append)
                span(style="font-size: 16px;") {{orderOnAct.out_symbol}}
            

            q-input(@change="change('root_remain_float')"  filled label-color="teal" type="number" :label="'Получаю'" v-model="root_remain_float"  controls-position="right" :precision="4" :step="1" :min="0" :max="max_root_remain_float").full-width
              template(v-slot:append)
                span(style="font-size: 16px;") {{root_token.symbol}}

            q-input( readonly filled label-color="teal" label="По курсу" v-model="orderOnAct.quote_rate"  ).full-width
              template(v-slot:append)
                span(style="font-size: 16px;") {{orderOnAct.out_symbol + ' /'}} {{root_token.symbol}}

            q-input(v-if="orderOnAct.type=='buy'" filled  label-color="teal" :label="details_caption" v-model="address")
            
            
      div.row
        div.col-6
          q-btn( @click="cancelAct").full-width отменить    
        div.col-6
          q-btn(color="teal" @click="create" :loading="loading").full-width подтвердить
        


  q-dialog(v-model="licenceDialog" persistent :maximized="maximazed" transition-show="slide-up" transition-hide="slide-down")

    q-card.full-width
      q-bar
        span(style="font-size: 14px;") соглашение о рисках
        q-space
        q-btn(unelevated dense flat icon="close" v-close-popup)
          q-tooltip Закрыть

      div.row
        div.q-mt-lg.q-mb-lg.col-md-12.col-xs-12.q-pl-md.q-pr-md
          // editor(:permlink="'permlink'" :showAudio="false" :content="licenceAgreement" :showMenu="false" :isDark="true" :isWriter="false" :add="false").full-width.goalCard.q-pr-sm.q-pl-sm.q-mt-sm
          p {{licenceAgreement}}
        div.full-width.text-right
          span(@click="saleAgreementConfirm = !saleAgreementConfirm").cursor-pointer подтверждаю
          q-checkbox( filled v-model="saleAgreementConfirm" label="" color="secondary")

      div.row
        div.col-6
          q-btn(@click="cancelAgreement").full-width отменить
        div.col-6
          q-btn(@click="cont" color="teal" :disabled="!saleAgreementConfirm").full-width продолжить
        


</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import {useP2PStore} from './store'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import {Notify} from "quasar"
import { useWindowSize } from 'vue-window-size'
const { width } = useWindowSize()
import axios from 'axios'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

onMounted(async () => {
  p2pStore.get_orders();
})


const p2pStore = useP2PStore()
console.log("PROPS:", props)

const props = defineProps({
  btc_rate: Number,
  type: String,
  orders: Array,
  root_token: Object,
  root_contract: String,
  root_symbol: String,
  quote_token: Object,
  quote_symbol: String,
  out_currency: String,
  bonus_rate: String,
  out_token: Object
})

const computed_orders = computed(() => props.orders.filter(el => el.creator != userStore.username))

const rootChain = chains.getRootChain()

const dialog = ref(false);
const saleAgreementConfirm = ref(false);
const maximazed = ref(false);
const orderOnAct = ref(null);
const details = ref({type: "", address: ""});
const root_remain_float = ref(0);
const max_root_remain_float = ref(0);
const address = ref("");
const username = computed(() => userStore.username);
const licenceDialog = ref(false);
const bonus_rate = ref(0);
const loading = ref(false);


const showRate = computed(() => {
  return true
})


const isMobile = computed(() => {
  return width.value < 1024
})

const p2pSale = computed(() => {
  return false
})

const columns = ref([
        {
          name: 'quoterate',
          label: 'Курс',
          align: 'left',
          field: 'quote_rate',
          display: true,  // отображать, если showRate = true
        },
        {
          name: 'remain',
          label: 'Сумма заявки',
          align: 'left',
          field: 'remain',
          display: true,
        },
        {
          name: 'bonus',
          label: 'Количество',
          align: 'left',
          field: 'bonus',
          display: true,  // отображать, если p2pSale = false
        },
        {
          name: 'action',
          label: 'Действие',
          align: 'left',
          field: 'action',
          display: true,
        },
      ],)


const visibleColumns = computed(() => {
  
    return columns.value.filter(col => col.display).map(col => col.name);
})


const CoreUserBalance = computed(() => {
  return userStore.userBalancesSafe[config.coreSymbol]
})

const floatCoreUserBalance = computed(() => {
  return CoreUserBalance.value ? parseFloat(CoreUserBalance.value) : 0
})


const showCreator = computed(() => {
  return true
})

const computed_bonus_rate = computed(() => {
  let p = parseFloat(0).toFixed(4) + ' ' + config.coreSymbol
  let r = Object.values(p2pStore.usdrates).find(el => el.out_asset == p)
  
  if (r)  {
    return parseFloat(r.rate).toFixed(16) + ' USD/' + config.coreSymbol
  }

  else return null
})


const usdrate = computed(() => {
  let p = parseFloat(0).toFixed(orderOnAct.value.out_precision) + ' ' + orderOnAct.value.out_symbol
  let r = Object.values(p2pStore.usdrates).find(el => el.out_contract == orderOnAct.value.out_contract && el.out_asset == p)
  if (r)
    return parseFloat(r.rate).toFixed(orderOnAct.value.out_precision) + ' USD/' + orderOnAct.value.out_symbol
  else return 0
})


const licenceAgreement = computed(() => {
  const content = config.agreement
  if (content) {
    return content
  } else return "Я совершаю добровольное безвозмездное пожертвование."
})



const details_caption = computed(() => {
  if (props.root_token.symbol == "BTC")
    return "Введите адрес BTC-кошелька"
  else return "Введите детали перевода"
})

const quote_quantity = computed(() => {
  console.log("quote_quantity", quote.value + ' ' + props.quote_token.symbol)
  return quote.value + ' ' + props.quote_token.symbol
})

const quote_rate = computed(() => {
  var quote_rate = 0
  if (showRate.value) {
    quote_rate = orderOnAct.value.quote_rate
  } else {
    quote_rate = parseFloat(computed_bonus_rate.value)
  }
  return quote_rate
})

const quote = computed(() => {
  return (root_remain_float.value * parseFloat(quote_rate.value)).toFixed(props.quote_token.precision)
})

const getLabel = computed(() => {
  if (orderOnAct.value.type == "buy")
    return "Получаю"
  else return "Отдаю"
})

const out_quantity = computed(() => {
  return (quote.value / usd_rate.value).toFixed(orderOnAct.value.out_precision)
})

const usd_rates = computed(() => {
  return Object.values(p2pStore.usdrates)
})

const usd_rate = computed(() => {
  if (orderOnAct.value) {
    let p = parseFloat(0).toFixed(orderOnAct.value.out_precision) + ' ' + orderOnAct.value.out_symbol
    let r = usd_rates.value.find(el => el.out_contract == orderOnAct.value.out_contract && el.out_asset == p)
    if (r) return parseFloat(r.rate).toFixed(orderOnAct.value.out_precision)
      else return 0
  } else return 0
})




const setMin = () => {
  root_remain_float.value = 0;
};

const setMax = () => {
  root_remain_float.value = max_root_remain_float.value;
};


const set10 = () => {
  root_remain_float.value = max_root_remain_float.value * 0.1
}


const set25 = () => {
  root_remain_float.value = max_root_remain_float.value * 0.25
}


const set50 = () => {
  root_remain_float.value = max_root_remain_float.value * 0.5
}


const set75 = () => {
  root_remain_float.value = max_root_remain_float.value * 0.75
}


const set100 = () => {
  root_remain_float.value = max_root_remain_float.value
}

const isAutoGateway = (order) => {
  return false
  // if (order.creator == config.coreHost || order.parent_creator == registrator.value.root_community)
  //   return registrator.value.gateway.find(el => order.out_symbol == el.symbol)
  // else return false
};

const cont = () => {
  licenceDialog.value = false;
  dialog.value = true;
};

const cancelAgreement = () => {
  licenceDialog.value = false;
  saleAgreementConfirm.value = false;
};


const create = async() => {
  const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

  if (details.value.address === "" && orderOnAct.value === "sell") {
    
    Notify.create({
      message: 'Установите детали платежа',
      color: 'orange', //'negative' 'teal'
      classes: 'notify-class',
    })

    if (floatTokenBalance.value === 0) {
      Notify.create({
          message: 'Недостаточный баланс',
          color: 'orange', //'negative' 'teal'
          classes: 'notify-class',
      })
    }

    return;
  } 
  
  details.value.type = props.out_token.symbol;

  if (orderOnAct.value.type === "sell") {
    // this.$q.localStorage.set(this.details.type, this.details.address)
  }

  if (root_remain_float.value <= 0) {
    Notify.create({
        message: 'Установите количество единиц',
        color: 'orange', //'negative' 'teal'
        classes: 'notify-class',
    })

    return;
  }

  console.log("orderOnAct: ", out_quantity.value) 

  let out = parseFloat(orderOnAct.value.out_remain).toFixed(orderOnAct.value.out_precision) + " " + orderOnAct.value.out_symbol

  var data = {

        username: userStore.username,
        parent_id: orderOnAct.value.id,
        type: orderOnAct.value.type == "buy" ? "sell" : "buy",
        root_contract: props.root_token.contract,
        root_quantity: parseFloat(root_remain_float.value).toFixed(props.root_token.precision) + " " + props.root_token.symbol,
        
        quote_type: "external",

        quote_rate: parseFloat(props.bonus_rate),
        quote_contract: "",
        quote_quantity: quote_quantity.value,
        
        out_type: "crypto",
        out_rate: parseFloat(usd_rate.value),
        out_contract: "",
        out_quantity: out,
        
        details: ""
        
      }

    
      console.log("data: ", data)
  try {
    console.log("here0", orderOnAct.value)
    if (data.type === "sell") {
      
      // let transferData = {
      //     from: data.username,
      //     to: config.tableCodeConfig.p2p,
      //     quantity: data.root_quantity,
      //     memo: ''
      //   }
      
      // api.transact({ 
      //   actions: [{
      //     account: data.root_contract,
      //     name: 'transfer',
      //     authorization: [{
      //       actor: userStore.username,
      //       permission: 'active',
      //     }],
      //     data: transferData,
      //   },
      //   {
      //     account: config.tableCodeConfig.p2p,
      //     name: 'createorder',
      //     authorization: [{
      //       actor: userStore.username,
      //       permission: 'active',
      //     }],
      //     data,
      //   }]
      // }, {
      //   blocksBehind: 3,
      //   expireSeconds: 30,
      // }).then(res => {
        
      //   p2pStore.get_orders({ hostname: hostStore.hostname.value });
      //   dialog.value = false;
      //   root_quantity.value = 1;
      //   userStore.getUserBalances()

      // }).catch(e => {
      //    Notify.create({
      //       message: e.message,
      //       color: 'negative', //'negative' 'teal'
      //       classes: 'notify-class',
      //   })
      // })
      // 
      // this.dialog = false
            // var self = this
            // let notify_params = {
            //       notify_to: this.orderOnAct.creator,
            //       status: 0,
            //       signature: "signature",
            //     }
        
            // this.$axios.get(self.registrator + '/notify', 
            //   {                
            //     params: notify_params
            //   }).then(message =>{

            //     console.log('notify', message)

            //   }).catch(e => {
            //     console.log('notify', e.message)
            //   })
              


    } else if (data.type === "buy") {
      console.log("on buy", data, config.tableCodeConfig.p2p, userStore.username)
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
        
        p2pStore.get_orders();
        
        dialog.value = false
        loading.value = false

        userStore.getUserBalances()

        Notify.create({
            message: "заявка на оказание помощи создана, ожидаем готовность получателя",
            color: 'teal', //'negative' 'teal'
            classes: 'notify-class',
        })


        var self = this
    
        var notify_params = {
              notify_to: orderOnAct.value.creator,
              status: 0,
              signature: "signature",
            }
        
         axios.get(config.registrator.api + '/notify', 
          {                
            params: notify_params
          }).then(message => {

            console.log('notify success', message)

          }).catch(e => {
            console.log('notify error', e.message)
          })
        
        router.push({name: "p2p"})


      }).catch(e => {
         Notify.create({
            message: e.message,
            color: 'negative', //'negative' 'teal'
            classes: 'notify-class',
        })
      })

    }
  } catch (e) {

      Notify.create({
          message: e.message,
          color: 'negative', //'negative' 'teal'
          classes: 'notify-class',
      })
  }     

}






const cancel = async (id) => {
  const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
    api.transact({ 
      actions: [
      {
        account: config.tableCodeConfig.p2p,
        name: 'cancel',
        authorization: [{
          actor: userStore.username,
          permission: 'active',
        }],
        data: {
          username: username.value, 
          id: id
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then(res => {
      p2pStore.get_orders();
      Notify.create({
          message: "Ордер снят",
          color: 'teal', //'negative' 'teal'
          classes: 'notify-class',
      })
    }).catch(e => {
        Notify.create({
          message: e.message,
          color: 'negative', //'negative' 'teal'
          classes: 'notify-class',
      })
    })

}




const core_rate = () => {
  let p2 = parseFloat(0).toFixed(4) + ' ' + config.coreSymbol;
  let r2 = usd_rates.value.find(el => el.out_asset === p2);
  if (r2)  
    return parseFloat(r2.rate);
  else 
    return 0;
};

const get_out_remain = (order) => {
  let p = parseFloat(0).toFixed(order.out_precision) + ' ' + order.out_symbol;
  let r = usd_rates.value.find(el => el.out_contract === order.out_contract && el.out_asset === p);
  let r2 = core_rate();

  if (r) {
    var rate2;
    if (showRate.value === false) {
      rate2 = r2;
    } else {
      rate2 = order.quote_rate;
    }
    return (parseFloat(order.root_remain) / parseFloat(r.rate) * parseFloat(rate2)).toFixed(order.out_precision) + ' ' + order.out_symbol;
  } else {
    return null;
  }
};

const change = (what) => {
  if (root_remain_float.value > max_root_remain_float.value){
    root_remain_float.value = max_root_remain_float.value;
  }
  else if (what === 'root_remain_float'){
    orderOnAct.value.out_remain = root_remain_float.value / parseFloat(usd_rate.value) * parseFloat(bonus_rate.value);
    orderOnAct.value.out_remain = orderOnAct.value.out_remain.toFixed(orderOnAct.value.out_precision);
  } else {
    root_remain_float.value = (parseFloat(orderOnAct.value.out_remain) * parseFloat(usd_rate.value) / parseFloat(bonus_rate.value)).toFixed(orderOnAct.value.out_precision);
  }
};

watch(root_remain_float, (newValue) => {
  change('root_remain_float')
})

const openDialog = (order) => {
  orderOnAct.value = JSON.parse(JSON.stringify(order));
  bonus_rate.value = quote_rate.value;
  
  max_root_remain_float.value = parseFloat(orderOnAct.value.root_remain) > (floatCoreUserBalance.value) ? parseFloat(orderOnAct.value.root_remain) : parseFloat(orderOnAct.value.root_remain);
   
  root_remain_float.value = max_root_remain_float.value

  orderOnAct.value.out_remain = root_remain_float.value / parseFloat(usd_rate.value) * parseFloat(bonus_rate.value);
  orderOnAct.value.out_remain = orderOnAct.value.out_remain.toFixed(orderOnAct.value.out_precision);
  address.value = orderOnAct.value.details.address;
  licenceDialog.value = true;

  

};

const cancelAct = () => {
  orderOnAct.value = null;
  dialog.value = false;
  cancelAgreement();
};

</script>
