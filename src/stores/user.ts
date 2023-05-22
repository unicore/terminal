import { defineStore } from 'pinia'
import { AccountData } from 'unicore/ts/src/auth'

import chains from '~/chainsMain'
import { useWalletStore } from './wallet'

interface UserBalances {
  [symbol: string]: string
}

interface UserState {
  authData: AccountData | null
  userBalances: UserBalances | null
  referrer: string
}

export const useUserStore = defineStore('user', {
  state: () =>
    ({
      authData: null,
      userBalances: null,
      referrer: '',
      registerNow: false,
    } as UserState),
  actions: {
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
