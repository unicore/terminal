<template lang="pug">
div.q-pa-md
  
  p Управление выводом
  
  div

    q-table(
      flat
      square

      :rows="withdraws"
      :columns="columns"
      row-key="id"
      :pagination={rowsPerPage: 0}
    ).text-center.full-width

      template(v-slot:body-cell-address="props")
        q-td(:props="props")
          p {{props.row.address}}
            q-btn(icon="fa fa-copy" flat dense @click="copy(props.row.address)" size="xs").q-ml-md
          // q-badge(outline color="orange" v-if="props.row.type == 'lottery'") в лотерее
          // q-badge(outline color="teal"  v-if="props.row.type == 'product'") купил продукт


      template(v-slot:body-cell-status="props")
        q-td(:props="props")
          q-badge(outline color="orange" v-if="props.row.status == 'process'") ожидает
          q-badge(outline color="red"  v-if="props.row.status == 'cancelled'") отклонен
          q-badge(outline color="primary"  v-if="props.row.status == 'completed'") оплачен
          

    
      template(v-slot:body-cell-actions="props")
        q-td(:props="props")
          q-btn(dense v-if="props.row.status == 'process'" color="red" @click="showCancel(props.row)").q-ma-xs отклонить
          q-btn(dense v-if="props.row.status == 'process'" color="secondary" @click="showWithdraw(props.row)").q-ma-xs подтвердить
          
          div(v-if="props.row.status == 'cancelled'")  
            span отклонено по причине: {{props.row.cancel_reason}}

          div(v-if="props.row.status == 'completed'")  
            span оплачено с подтверждением: {{props.row.trx_id}}




  q-dialog(v-model="dialog" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")  
    q-card(style="min-width: 350px; max-width: 100%;").bg-primary.text-white
      div
        q-bar
          span Подтвердить вывод
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close

        div
          q-input(filled label-color="white" label="Вставьте ссылку на подтверждение" v-model="trxId")
          // q-input(filled label-color="white" type="textarea" label="Описание" v-model="newProduct.description")
          // q-input(filled label-color="white" type="number" step="1" max="100" label="Кэбэк партнёрам, %" v-model="newProduct.referral_percent")
          // q-input(filled label-color="white" type="number" step="1" max="100" label="Кэшбэк в ядро, %" v-model="newProduct.core_cashback_percent")
          
          // q-input(filled label-color="white" type="number" label="Себестоимость" v-model="newProduct.price")
          // p.q-pa-md вы уверены, что совершили перевод?
          div
            q-btn(@click="dialog = false" ) отменить
            q-btn(@click="confirmWithdraw" ) подтвердить


  q-dialog(v-model="dialog2" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")  
    q-card(style="min-width: 350px; max-width: 100%;").bg-red.text-white
      div
        q-bar
          span Отклонить вывод
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close

        div
          q-input(filled label-color="white" label="Опишите причину" v-model="cancel_reason")
          // q-input(filled label-color="white" type="textarea" label="Описание" v-model="newProduct.description")
          // q-input(filled label-color="white" type="number" step="1" max="100" label="Кэбэк партнёрам, %" v-model="newProduct.referral_percent")
          // q-input(filled label-color="white" type="number" step="1" max="100" label="Кэшбэк в ядро, %" v-model="newProduct.core_cashback_percent")
          
          // q-input(filled label-color="white" type="number" label="Себестоимость" v-model="newProduct.price")
          // p.q-pa-md вы уверены, что совершили перевод?
          div
            q-btn(@click="dialog2 = false" ) отменить
            q-btn(@click="confirmCancel" ) подтвердить


</template>

<script setup lang="ts">

import { computed, ref, onMounted} from 'vue'

import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import { copyToClipboard, Notify } from 'quasar'
import config from '~/config'
import chains from '~/chainsMain'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()


const router = useRouter()
const dialog = ref(false)
const dialog2 = ref(false)

const onWithdraw = ref({})
const onCancel = ref({})
const trxId = ref("")
const cancel_reason = ref("")

const columns = ref([
      {
        name: 'id',
        required: true,
        label: 'ID',
        align: 'left',
        field: 'id'
      },
      {
        name: 'status',
        required: true,
        label: 'Статус',
        align: 'left',
        field: 'status'
      },
      {
        name: 'amount',
        required: true,
        label: 'Сумма',
        align: 'left',
        field: 'amount'
      },
      {
        name: 'contract',
        required: true,
        label: 'Контракт',
        align: 'left',
        field: 'contract'
      },
      {
        name: 'username',
        required: true,
        label: 'Пользователь',
        align: 'left',
        field: 'username'
      },
      {
        name: 'address',
        required: true,
        label: 'Адрес',
        align: 'left',
        field: 'address'
      },
      
      {
        name: 'actions',
        label: 'Действия',
        field: 'actions',
        required: true,
        align: 'left',
      }
    ])


const loading = ref(false)

const hostStore = useHostStore()

const withdraws = computed(() => {return Object.values(hostStore.getWithdraws)})

onMounted(async () => {
  hostStore.loadWithdraws(config.coreHost)
})

const showWithdraw = async (element) => {
  dialog.value = true
  onWithdraw.value = element
}


const showCancel = async (element) => {
  dialog2.value = true
  onCancel.value = element
}

const isProcessed = (withdraw) => {
  return withdraw.status
}


const confirmCancel = async () => {
  console.log("onCancel: ", onCancel.value)
  loading.value = true
  
    try {

    const rootChain = chains.getRootChain()
    const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
   
    
    let actions = [
      {
        account: config.tableCodeConfig.withdrawer,
        name: 'cancel',
        authorization: [
          {
            actor: userStore.username as string,
            permission: 'active',
          },
        ],
        data: {
            host: config.coreHost,
            admin: config.admin,
            withdraw_id: onCancel.value.id,
            cancel_reason: cancel_reason.value
        }
      }
    ]


    await api.transact(
      {
        actions: actions
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    )

    Notify.create({
      message: 'Вывод Отклонен',
      color: 'positive',
    })
      
    hostStore.loadWithdraws(config.coreHost)
    dialog2.value = false
    cancel_reason.value = ""
   
  } catch (e: any) {
    
    loading.value = false

    console.log(e)
    Notify.create({
      message: 'Произошла ошибка: ' + e.message,
      color: 'negative',
    })
  }


}


const confirmWithdraw = async () => {
  

  loading.value = true
  
    try {

    const rootChain = chains.getRootChain()
    const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
   
    
    let actions = [
      {
        account: config.tableCodeConfig.withdrawer,
        name: 'complete',
        authorization: [
          {
            actor: userStore.username as string,
            permission: 'active',
          },
        ],
        data: {
            host: config.coreHost,
            admin: config.admin,
            withdraw_id: onWithdraw.value.id,
            trx_id: trxId.value
        }
      }
    ]


    await api.transact(
      {
        actions: actions
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    )

    Notify.create({
      message: 'Вывод подтвержден',
      color: 'positive',
    })
      
    hostStore.loadWithdraws(config.coreHost)
    dialog.value = false
    trxId.value = ""
   
  } catch (e: any) {
    
    loading.value = false

    console.log(e)
    Notify.create({
      message: 'Произошла ошибка: ' + e.message,
      color: 'negative',
    })
  }


}



const copy = async (address) => {
  copyToClipboard(address)
    .then(() => {
      Notify.create({
        message: 'Адрес скопирован',
        type: 'positive',
      })

    })
    .catch((e) => {
      console.log(e)
    })
}

</script>
