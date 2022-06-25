import { defineStore } from 'pinia'
import { NftObject, NftMarketObject } from 'unicore/dist/src/blockchain/contracts/nft'

import chains from '~/chainsMain'

interface Nfts {
  [id: number]: NftObject
}

interface NftMarkets {
  [id: number]: NftMarketObject
}

interface NftState {
  nfts: Nfts
  markets: NftMarkets
  loading: boolean
}

export const useNftStore = defineStore('nft', {
  state: () =>
    ({
      nfts: {},
      markets: {},
      loading: false,
    } as NftState),
  actions: {
    async loadAvailableNfts() {
      this.loading = true
      const rootChain = chains.getRootChain()
      this.nfts = {
        ...this.nfts,
        ...(await rootChain.nftContract.getAllObjects()).reduce(
          (a, n) => ({ ...a, [n.id]: n }),
          {}
        ),
      }
      this.markets = (await rootChain.nftContract.getMarket()).reduce(
        (a, n) => ({ ...a, [n.id]: n }),
        {}
      )
      this.loading = false
    },
    removeNft(id: number) {
      this.nfts = Object.keys(this.nfts)
        .map(Number)
        .reduce((a, nid) => {
          if (id !== nid) {
            a[nid] = this.nfts[nid]
          }
          return a
        }, {} as Nfts)
    },
  },
  getters: {
    nftIds: (state) => Object.keys(state.nfts).map(Number),
    nftMarketIds: (state) => Object.keys(state.markets).map(Number),
    getNftById: (state) => (id: number) => state.nfts[id],
    getNftMarketById: (state) => (id: number) => state.markets[id],
    getNftIdByMarketId(state) {
      return (id: number) => state.markets[id].object_id
    },
    getNftMarketIdByNftId() {
      return (id: number) =>
        this.nftMarketIds.find((m) => this.getNftMarketById(m).object_id === id)
    },
    getNftMarketIdsByNftId() {
      return (id: number) =>
        this.nftMarketIds.filter((m) => this.getNftMarketById(m).object_id === id)
    },
    getNftIdsByUsername() {
      return (username: string) =>
        this.nftIds.filter((id) => {
          const nft = this.getNftById(id)

          return nft.creator === username
        })
    },
  },
})
