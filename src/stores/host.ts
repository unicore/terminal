import { defineStore } from 'pinia'
import chains from '~/chainsMain'
import config from "~/config"
import {lazyFetch} from '~/utils/fetcher'
import moment from 'moment-with-locales-es6';
import { useUserStore } from '~/stores/user'

// import 
interface Hosts {
  [username: string]: any
}

interface HostState {
  hosts: Hosts
}

interface History {
  [id: string]: any
}

interface HistorytState {
  history: History
}


interface Balances {
  [id: number]: any
}

interface BalanceState {
  balances: userBalances
}

export const useHostStore = defineStore('host', {
  state: () =>
    ({
      hosts: {},
      pools: {},
      balances: {},
      allUserBalances: {},
      history: {},
      withdraws: {},
      conditions: {},
      permissions: {},
      products: {},
      userProducts: {},
      rates: {},
      incomes: {},
      isUserSubscribed: false,
      subLoaded: false,
      flows: {},
      sysPercents: {},
      userTokenStats: {}
    } as HostState),
  actions: {
    
    async editHost(hostname, title, purpose, manifest){
      const userStore = useUserStore()
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
      
      let data = {
              architect: userStore.username,
              host: hostname, 
              platform: hostname,
              title,
              purpose,
              manifest: manifest || "",
              power_market_id: "",
              meta: "",
              
            }

      console.log('data: ', data)

      let res = await api.transact({ 
          actions: [
          {
            account: config.tableCodeConfig.core,
            name: 'edithost',
            authorization: [{
              actor: userStore.username as string,
              permission: 'active',
            }],
            data,
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        })

       return res
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

    async loadAllBalances(hostname) {

      const rootChain = await chains.getRootChain()
     
      try {

        let balances = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.core,
          hostname,
          'balance',
        )
        
        this.balances = balances.reduce((a, n) => ({ ...a, [n.id]: n }), {})

      } catch(e){

        console.log("error on load userbalances: ", e.message)

      }

    },

    async loadGpercents() {

      const rootChain = await chains.getRootChain()
     
      try {

        let sysPercents = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.core,
          config.tableCodeConfig.core,
          'gpercents',
        )
        
        this.sysPercents = sysPercents.reduce((a, n) => ({ ...a, [n.key]: n.value / 10000}), {})
        console.log("sysPercents: ", this.sysPercents)
      } catch(e){

        console.log("error on load sysPercents: ", e.message)

      }

    },

    async loadDacsIncome(hostname) {
      const rootChain = await chains.getRootChain()
     
      try {
        let incomes = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.core,
          hostname,
          'dacsincome',
        )
        
        this.incomes = incomes.reduce((a, n) => ({ ...a, [n.id]: n }), {})

      } catch(e){

        console.error(e.message)

      }

    },
    async loadBalances(username, hostname) {
      const rootChain = await chains.getRootChain()
     
      try {
        let balances = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.core,
          hostname,
          'balance',
        )
        
        balances = balances.filter(b => b.owner == username)
        
        this.balances = balances.reduce((a, n) => ({ ...a, [n.id]: n }), {})

      } catch(e){

        console.log("error on load userbalances: ", e.message)

      }

    },
    async loadAllUserBalances(username){
      await this.loadHosts()
      
      // this.allUserBalances = {}
      
      for (let host of Object.values(this.hosts)){
          const rootChain = await chains.getRootChain()
     
          try {

            let balances = await lazyFetch(
              rootChain.readApi, 
              config.tableCodeConfig.core,
              host.username,
              'balance',
            )
            
            balances = balances.filter(b => b.owner == username)
            
            if (balances.length > 0) {
              this.allUserBalances[host.username] = {}
              this.allUserBalances[host.username]['host'] = host 
              this.allUserBalances[host.username]['balances'] = balances.reduce((a, n) => ({ ...a, [n.id]: n }), {})
            }
            
          } catch(e){

            console.log("error on load userbalances: ", e.message)

          }
      }
    },
    async loadHosts() {
      
      const rootChain = await chains.getRootChain()
  
      try {

        let hosts = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.core,
          config.tableCodeConfig.core,
          'hosts',
        )

        if (hosts) {

          for (let host of hosts){
            try{

              host.meta = JSON.parse(host.meta)

            } catch(e){}

            let [cPool] = await lazyFetch(
              rootChain.readApi, 
              config.tableCodeConfig.core,
               host.username,
              'pool',
              host.current_pool_id,
              host.current_pool_id,
              null,
              1
            )

            host.currentPool = cPool


            let [spiral] = await lazyFetch(
              rootChain.readApi, 
              config.tableCodeConfig.core,
               host.username,
              'spiral',
              0,
              0,
              null,
              1
            )
            
            host.spiral = spiral
            host.profitStep = parseFloat(spiral.overlap / 100 - 100).toFixed(0)
 
            let [currentRate] = await lazyFetch(
              rootChain.readApi, 
              config.tableCodeConfig.core,
               host.username,
              'rate',
              host.current_pool_num - 1,
              host.current_pool_num - 1,
              null,
              1
            )

            host.currentRate = currentRate
          }
          
          this.hosts = hosts.reduce((a, n) => ({ ...a, [n.username]: n }), {})
          
        }

        
      } catch (e) {
        console.error("error: ", e)
      }
    },

    async loadHost(hostname) {
      
      const rootChain = await chains.getRootChain()
      
      try {

        let [host] = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.core,
          config.tableCodeConfig.core,
          'hosts',
          hostname,
          hostname,
          null,
          1
        )

        if (host) {
            try{

              host.meta = JSON.parse(host.meta)

            } catch(e){}

            let [cPool] = await lazyFetch(
              rootChain.readApi, 
              config.tableCodeConfig.core,
               host.username,
              'pool',
              host.current_pool_id,
              host.current_pool_id,
              null,
              1
            )

            host.currentPool = cPool


            let [spiral] = await lazyFetch(
              rootChain.readApi, 
              config.tableCodeConfig.core,
               host.username,
              'spiral',
              0,
              0,
              null,
              1
            )
            
            host.spiral = spiral
            host.profitStep = parseFloat(spiral.overlap / 100 - 100).toFixed(0)
 
            let [currentRate] = await lazyFetch(
              rootChain.readApi, 
              config.tableCodeConfig.core,
               host.username,
              'rate',
              host.current_pool_num - 1,
              host.current_pool_num - 1,
              null,
              1
            )

            host.currentRate = currentRate
          
          
          this.hosts = [host].reduce((a, n) => ({ ...a, [n.username]: n }), {})
          
        }

        
      } catch (e) {
        console.error("error: ", e)
      }
    },


    async loadRates(hostname) {
      const rootChain = await chains.getRootChain()
  
      let rates = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.core,
          hostname,
          'rate',
        )
      console.log("o load rates", rates)
      this.rates = rates.reduce((a, n) => ({ ...a, [n.pool_id]: n }), {})
        
    },

    async loadFlows(hostname) {
      const rootChain = await chains.getRootChain()
  
      let flows = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.secret,
          hostname,
          'flows',
        )
      console.log("o load flows", flows)
      this.flows = flows.reduce((a, n) => ({ ...a, [n.id]: n }), {})
        
    },
    async loadProducts(hostname) {
      
      const rootChain = await chains.getRootChain()
  
      try {

        let products = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.secret,
          hostname,
          'products',
        )

        // history.reverse()
        console.log("products: ", products)
        this.products = products.reduce((a, n) => ({ ...a, [n.id]: n }), {})
        
        
      } catch (e) {
        console.error("error: ", e)
      }
    },
    
    async loadPermissions(hostname) {
      
      const rootChain = await chains.getRootChain()
  
      try {

        let conditions = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.core,
          hostname,
          'permissions',
        )

        // history.reverse()
        
        this.permissions = permissions.reduce((a, n) => ({ ...a, [n.id]: n }), {})
        

      } catch (e) {
        console.error("error: ", e)
      }
    },

    async loadConditions(hostname) {
      
      const rootChain = await chains.getRootChain()
  
      try {

        let conditions = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.core,
          hostname,
          'conditions',
        )

        // history.reverse()
        
        this.conditions = conditions.reduce((a, n) => ({ ...a, [n.key_string]: n.value }), {})
        

      } catch (e) {
        console.error("error: ", e)
      }
    },

    async checkSubscription(hostname, username){

      await this.loadConditions(hostname)
      
      if (this.conditions.coreproduct){
        await this.loadProducts(hostname) 
        await this.loadMyProducts(hostname, username)
      }

      this.subLoaded = true
    },


    async loadMyProducts(hostname, username) {
      console.log("username: ", username, hostname)
      const rootChain = await chains.getRootChain()
  
      try {

        let userProducts = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.secret,
          hostname,
          'myproducts',
          username,
          username,
          null, 
          2,
          'i64'
        )

        // history.reverse()
        
        this.userProducts = userProducts.reduce((a, n) => ({ ...a, [n.id]: n }), {})
        console.log("on get history", this.userProducts)
      

        
      } catch (e) {
        console.error("error: ", e)
      }
    },


    async loadAllUserProducts(hostname) {
      const rootChain = await chains.getRootChain()
  
      try {

        let userProducts = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.secret,
          hostname,
          'myproducts',
        )

        // history.reverse()
        
        this.userProducts = userProducts.reduce((a, n) => ({ ...a, [n.id]: n }), {})
     
        
      } catch (e) {
        console.error("error: ", e)
      }
    },


    async loadHistory(hostname) {
      
      const rootChain = await chains.getRootChain()
  
      try {

        let history = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.core,
          hostname,
          'coredhistory',
        )

        // history.reverse()
        
        this.history = history.reduce((a, n) => ({ ...a, [n.id]: n }), {})
        // console.log("on get history", this.history)
      

        
      } catch (e) {
        console.error("error: ", e)
      }
    },
    async loadWithdraws(host) {
      
      const rootChain = await chains.getRootChain()
  
      try {

        let withdraws = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.withdrawer,
          host,
          'withdraws',
        )

        // history.reverse()
        
        this.withdraws = withdraws.reduce((a, n) => ({ ...a, [n.id]: n }), {})
        // console.log("on get history", this.history)
      

        
      } catch (e) {
        console.error("error: ", e)
      }
    },
    async loadTreeOfPartners() {
      
      const rootChain = await chains.getRootChain()
  
      try {

        let tree = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.part,
          config.tableCodeConfig.part,
          'partners2'
        )
        
        return tree
        
      } catch (e) {
        console.error("error: ", e)
      }
    },
  },
  getters: {
    getHosts: (state) => state.hosts,
    getBalances: (state) => state.balances,
    getAllUserBalances: (state) => state.allUserBalances,
    // getUserBalances: (state) => state.balances,
    getHistory: (state) => state.history,
    getCurrentHost(state) {
      return (username: string) => {
        return state.hosts[username]
    }},
    getWithdraws: (state) => state.withdraws,
    getUserStatus: (state) => {
      //TODO check for expiration
      let userProduct = state.userProducts[state.conditions['coreproduct']]
      
      if (userProduct){
        let now = moment.utc()
        let expired_at = moment.utc(userProduct.expired_at)

        const diffInSeconds = expired_at.diff(now, 'seconds');

        return diffInSeconds > 0
      } else return false
      
    }
  },
})
