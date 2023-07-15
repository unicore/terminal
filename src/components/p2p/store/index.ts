import { defineStore } from 'pinia'
import chains from '~/chainsMain'
import { encrypt, decrypt } from 'eos-encrypt';

import config from "~/config"
import {lazyFetch} from '~/utils/fetcher'

import { useUserStore } from '~/stores/user'
const userStore = useUserStore()

const rootChain = chains.getRootChain()

interface Products {
  [id: number]: any
}

interface ProductsState {
  products: Pallets
}

export const useP2PStore = defineStore('p2p', {
  state: () =>
    ({
      orders: {},
      usdrates: {},
      isEducation: true,
      userTokenStats: {}
    } as ProductsState),
  actions: {
    async get_orders() {
      try {

        let orders = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.p2p,
          config.tableCodeConfig.p2p,
          'orders',
        )
        

        orders.map(el => {
          try{
            el.details = JSON.parse(el.details)   
            el.root_remain_float = parseFloat(el.root_remain)
            el.quote_quantity       
          } catch(e){
            el.details = el.details
          }

        })

        this.orders = orders.reduce((a, n) => ({ ...a, [n.id]: n }), {})

      } catch(e){

        console.log("error on load userbalances: ", e.message)

      }


    },
    async get_usdrates(){

      const rootChain = await chains.getRootChain()
     
      try {

        let rates = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.p2p,
          config.tableCodeConfig.p2p,
          'usdrates',
        )
        

        this.usdrates = rates.reduce((a, n) => ({ ...a, [n.id]: n }), {})

      } catch(e){

        console.log("error on load userbalances: ", e.message)

      }
    },

    async getUserStat(username, symbol, contract){

      const rootChain = await chains.getRootChain()
     
      try {

        let stats = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.core,
          symbol,
          'userstat',
          username,
          username,
          null, 
          2,
          'i64'
        )
        
        console.log("stats: ", stats)
        stats = stats.filter(el => el.symbol == symbol && el.contract == contract)

        this.userTokenStats = stats.reduce((a, n) => ({ ...a, [n.symbol]: n }), {})

      } catch(e){

        console.log("error on load userbalances: ", e.message)

      }
    },

    async cancelOrder(username, id) {
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

       let res = await api.transact({ 
          actions: [
          {
            account: config.tableCodeConfig.p2p,
            name: 'cancel',
            authorization: [{
              actor: userStore.username as string,
              permission: 'active',
            }],
            data: {
              username,
              id
            },
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        })

       return res
    },

     


    async delOrder(username, id){
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

      let res = await api.transact({ 
          actions: [
          {
            account: config.tableCodeConfig.p2p,
            name: 'del',
            authorization: [{
              actor: userStore.username as string,
              permission: 'active',
            }],
            data: {
              username,
              id
            },
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        })

       return res
    },





    async acceptOrder(username, id, details) {
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

      let res = await api.transact({ 
          actions: [
          {
            account: config.tableCodeConfig.p2p,
            name: 'accept',
            authorization: [{
              actor: userStore.username as string,
              permission: 'active',
            }],
            data: {
              username,
              id,
              details
            },
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        })

       return res
    },

    async confirmOrder(username, id){
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

      let res = await api.transact({ 
          actions: [
          {
            account: config.tableCodeConfig.p2p,
            name: 'confirm',
            authorization: [{
              actor: userStore.username as string,
              permission: 'active',
            }],
            data: {
              username,
              id,
            },
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        })

       return res
    },

     async approveOrder(username, id){
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

      let res = await api.transact({ 
          actions: [
          {
            account: config.tableCodeConfig.p2p,
            name: 'approve',
            authorization: [{
              actor: userStore.username as string,
              permission: 'active',
            }],
            data: {
              username,
              id,
            },
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        })

       return res
    }




  },
  getters: {
    // symbols: (state) => Object.keys(state.wallets),
  },
})
