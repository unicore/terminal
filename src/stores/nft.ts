import { defineStore } from 'pinia'
import {
  NftObject,
  NftMarketObject,
  NftMarketRequest,
} from 'unicore/dist/src/blockchain/contracts/nft'

import chains from '~/chainsMain'
import config from '~/config'
import { useUserStore } from './user'

interface Nfts {
  [id: number]: NftObject
}

interface NftMarkets {
  [id: number]: NftMarketObject
}

interface NftMarketRequests {
  [id: number]: NftMarketRequest
}

interface NftState {
  nfts: Nfts
  markets: NftMarkets
  requests: NftMarketRequests
  loading: boolean
}

interface CacheProp {
  [id: string]: any
}

let CACHE: CacheProp = {}

const resetCache = () => {
  console.log('RESET NFT CACHE')
  CACHE = {}
}

export const useNftStore = defineStore('nft', {
  state: () =>
    ({
      nfts: {},
      markets: {},
      requests: {},
      cache: {},
      loading: false,
    } as NftState),
  actions: {
    async loadAvailableNfts() {
      this.loading = true
      const rootChain = chains.getRootChain()

      const [allObjects, marketObjects] = await Promise.all([
        rootChain.nftContract.getAllObjects(),
        rootChain.nftContract.getMarket(),
        this.loadRequests(),
      ])
      this.nfts = {
        ...this.nfts,
        ...allObjects.reduce((a, n) => ({ ...a, [n.id]: n }), {}),
      }
      this.markets = marketObjects.reduce((a, n) => ({ ...a, [n.id]: n }), {})
      resetCache()
      this.loading = false
    },
    async loadRequests() {
      const rootChain = chains.getRootChain()
      const userStore = useUserStore()

      const requestsPromise = userStore.username
        ? rootChain.nftContract.fetchRequests(userStore.username)
        : Promise.resolve([])
      const requestsObjects = await requestsPromise
      this.requests = requestsObjects.reduce((a, n) => ({ ...a, [n.id]: n }), {})
      resetCache()
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
      resetCache()
    },
  },
  getters: {
    nftIds: (state) => Object.keys(state.nfts).map(Number),
    nftMarketIds: (state) => Object.keys(state.markets).map(Number),
    nftRequestIds: (state) => Object.keys(state.requests).map(Number),
    getNftById: (state) => (id: number) => state.nfts[id],
    getNftMarketById: (state) => (id: number) => state.markets[id],
    getNftMarketRequestById: (state) => (id: number) => state.requests[id],
    getNftIdByMarketId(state) {
      return (id: number) => state.markets[id].object_id
    },
    getNftMarketIdByNftId() {
      return (id: number) => {
        const k = `getNftMarketIdByNftId_${id}`
        console.log(k, CACHE)
        if (!CACHE[k]) {
          CACHE[k] = this.nftMarketIds.find((m) => this.getNftMarketById(m).object_id === id)
        } else {
          console.log('CACHE HIT!')
        }

        return CACHE[k] as NftMarketObject
      }
    },
    getNftMarketIdsByNftId() {
      return (id: number) => {
        const k = `getNftMarketIdsByNftId_${id}`
        console.log(k, CACHE)
        if (!CACHE[k]) {
          CACHE[k] = this.nftMarketIds.filter((m) => this.getNftMarketById(m).object_id === id)
        } else {
          console.log('CACHE HIT!')
        }

        return CACHE[k] as number[]
      }
    },
    getNftIdsByUsername() {
      return (username: string) => {
        const k = `getNftIdsByUsername_${username}`
        console.log(k, CACHE)
        if (!CACHE[k]) {
          CACHE[k] = this.nftIds.filter((id) => {
            const nft = this.getNftById(id)

            return nft.creator === username
          })
        } else {
          console.log('CACHE HIT!')
        }

        return CACHE[k] as number[]
      }
    },
    nftWallet() {
      const rootChain = chains.getRootChain()
      return rootChain.getWalletBySymbol(config.nft.tokenSymbol)!
    },
    getNftMarketRequestIdsByBuyer() {
      return (username: string) => {
        const k = `getNftMarketRequestIdsByBuyer_${username}`
        console.log(k, CACHE)
        if (!CACHE[k]) {
          CACHE[k] = this.nftRequestIds.filter((id) => {
            const request = this.getNftMarketRequestById(id)

            return request.buyer === username
          })
        } else {
          console.log('CACHE HIT!')
        }

        return CACHE[k] as number[]
      }
    },
    getNftMarketRequestIdsBySeller() {
      return (username: string) => {
        const k = `getNftMarketRequestIdsBySeller_${username}`
        console.log(k, CACHE)
        if (!CACHE[k]) {
          CACHE[k] = this.nftRequestIds.filter((id) => {
            const request = this.getNftMarketRequestById(id)

            return request.seller === username
          })
        } else {
          console.log('CACHE HIT!')
        }

        return CACHE[k] as number[]
      }
    },
    getNftMarketRequestIdsByMarketId() {
      return (marketId: number) => {
        const k = `getNftMarketRequestIdsByMarketId_${marketId}`
        console.log(k, CACHE)
        if (!CACHE[k]) {
          CACHE[k] = this.nftRequestIds.filter((id) => {
            const request = this.getNftMarketRequestById(id)

            return request.market_id === marketId
          })
        } else {
          console.log('CACHE HIT!')
        }

        return CACHE[k] as number[]
      }
    },
  },
})
