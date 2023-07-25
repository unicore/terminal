import { defineStore } from 'pinia'
import { AccountData } from 'unicore/ts/src/auth'
import {lazyFetch} from '~/utils/fetcher'

import chains from '~/chainsMain'
import { useWalletStore } from './wallet'
import config from "~/config"

interface UserBalances {
  [symbol: string]: string
}

interface UserState {
  authData: AccountData | null
  userBalances: UserBalances | null
  referrer: string,
}

export const useUserStore = defineStore('user', {
  state: () =>
    ({
      authData: null,
      userBalances: null,
      referrer: '',
      registerNow: false,
      partner: null,
      userObject: null
    } as UserState),
  actions: {

    async saveNickname(nickname: string) {
      this.partner = {}
      const rootChain = chains.getRootChain()

      const api = rootChain.getEosPassInstance(this.authData?.wif as string)
      console.log("nickname: ", nickname)
       let res = await api.transact({ 
          actions: [
          {
            account: config.tableCodeConfig.part,
            name: 'setnickname',
            authorization: [{
              actor: this.username as string,
              permission: 'active',
            }],
            data: {
              username: this.username,
              nickname: nickname as string
            },
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        })

       return res
      
    },
    async getUserPartnerInfo(username: string) {
      this.partner = {}
      const rootChain = chains.getRootChain()

      let [partner] = await lazyFetch(
          rootChain.readApi, 
          config.tableCodeConfig.part,
          config.tableCodeConfig.part,
          'partners2',
          username,
          username,
          null,
          1
        )

      this.partner = partner
      return partner

    },

    async setReferrer(ref: string) {
      this.referrer = ''
      const rootChain = chains.getRootChain()
      try {
        const res = await rootChain.readApi.getAccount(ref)
        if (res) {
          this.referrer = ref
        }
      } catch (e) {
        console.error(ref, 'there is no referer')
      }
    },
    async getAccount(username: string) {
      this.referrer = ''
      const rootChain = chains.getRootChain()
      try {
        const res = await rootChain.readApi.getAccount(username)
        if (res) {
          this.userObject = res
          console.log("getAccount: ", res)

        }
      } catch (e) {
        console.error(ref, 'there is no referer')
      }
    },
    async setRegisterNow(value){
      this.registerNow = value
    },
    async getUserBalances() {
      if (!this.authData?.name) {
        this.userBalances = null
        return
      }

      const walletStore = useWalletStore()

      const symbols = walletStore.symbols
      const rootChain = chains.getRootChain()

      const results = await Promise.all(
        symbols.map(
          (symbol) =>
            rootChain.getWalletBySymbol(symbol)?.getUserBalance(this.authData?.name as string) ||
            Promise.resolve(null)
        )
      )

      this.userBalances = symbols.reduce((a, symbol, i) => ({ ...a, [symbol]: results[i] }), {})
    },
    async login(data: AccountData) {
      const walletStore = useWalletStore()
      await walletStore.loadWallets()
      this.authData = { ...data, mnemonic: '' }
      this.referrer = ''
      await this.getUserBalances()
    },
    logout() {
      this.authData = null
    },
  },
  getters: {
    username: (state) => state.authData?.name,
    isAdmin() {
      return this.username === config.admin
    },
    hasAuth() {
      return !!this.username
    },
    userBalancesSafe(): UserBalances {
      return this.userBalances || {}
    },
  },
  persist: {
    paths: ['authData', 'referrer'],
  },
})
