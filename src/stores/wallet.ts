import { defineStore } from 'pinia'
import chains from '~/chainsMain'

interface Wallets {
  [symbol: string]: any
}

interface WalletState {
  wallets: Wallets
}

export const useWalletStore = defineStore('wallet', {
  state: () =>
    ({
      wallets: {},
    } as WalletState),
  actions: {
    async loadWallets() {
      const rootChain = chains.getRootChain()
      const walletsSymbols = rootChain.walletsSymbols
      this.wallets = walletsSymbols.reduce((a, symbol) => {
        a[symbol] = null
        return a
      }, {} as Wallets)
    },
  },
  getters: {
    symbols: (state) => Object.keys(state.wallets),
  },
})
