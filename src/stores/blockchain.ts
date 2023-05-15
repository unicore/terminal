import { defineStore } from 'pinia'
import chains from '~/chainsMain'

interface Blockchain {
  [server_version: string]: any
}

interface blockchainState {
  blockchain: Blockchain
}

export const useBlockchainStore = defineStore('blockchain', {
  state: () =>
    ({
      info: {},
    } as WalletState),
  actions: {
    async loadInfo() {
      
      const rootChain = chains.getRootChain()
      let instance = await rootChain.readApi.getInstance()
      let info = await instance.getInfo({})
      this.info = info
    },
    async getBlock(id) {
        console.log("get block", id)
        const rootChain = chains.getRootChain()
        let instance = await rootChain.readApi.getInstance()
        let block = await instance.getBlock(id)
        return block
      }
  },
  getters: {
    getInfo: (state) => state.info,
  },
})
