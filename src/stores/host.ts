import { defineStore } from 'pinia'
import chains from '~/chainsMain'
import config from "~/config"
import {lazyFetch} from '~/utils/fetcher'

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
    } as HostState),
  actions: {
    async loadBalances(username, hostname){
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
            // console.log("params on fetch rate: ", config.tableCodeConfig.core,
            //    host.username,
            //   'rate',
            //   host.current_pool_num - 1,
            //   host.current_pool_num - 1,
            //   null,
            //   1)

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
            // console.log("host.currentRate: ", host.currentRate)
          }
          
          this.hosts = hosts.reduce((a, n) => ({ ...a, [n.username]: n }), {})
          
        }

        
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
    async loadWithdraws() {
      
      const rootChain = await chains.getRootChain()
  
      try {

        let withdraws = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.withdrawer,
          config.tableCodeConfig.withdrawer,
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
        console.log("tree load", tree)
        
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
  },
})
