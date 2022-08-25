import { defineStore } from 'pinia'
import {
  NftObject,
  NftMarketObject,
  NftMarketRequest,
  NftPieceObject,
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

export interface NftPieces {
  [id: number]: NftPieceObject
}

interface NftState {
  nfts: Nfts
  markets: NftMarkets
  requests: NftMarketRequests
  pieces: NftPieces
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
      pieces: {},
      loading: false,
    } as NftState),
  actions: {
    async loadMarketNftById(id: number) {
      this.loading = true
      const rootChain = chains.getRootChain()

      const marketObjects = await rootChain.nftContract.getMarketObjectsById(id)
      const allObjects = await rootChain.nftContract.getObjectsById(id)
      await this.loadRequests()

      this.nfts = {
        ...this.nfts,
        ...allObjects.reduce((a, n) => ({ ...a, [n.id]: n }), {}),
      }
      this.markets = marketObjects.reduce((a, n) => ({ ...a, [n.id]: n }), {})
      resetCache()
      this.loading = false
    },
    async loadAvailableNfts() {
      this.loading = true
      const rootChain = chains.getRootChain()

      const userStore = useUserStore()

      const [allObjects, marketObjects, ownedObjects] = await Promise.all([
        rootChain.nftContract.getAllObjects(),
        rootChain.nftContract.getMarket(),
        userStore.username
          ? rootChain.nftContract.getObjectsByOwner(userStore.username)
          : Promise.resolve([]),
        this.loadRequests(),
      ])
      this.nfts = {
        ...this.nfts,
        ...allObjects.reduce((a, n) => ({ ...a, [n.id]: n }), {}),
      }
      this.markets = marketObjects.reduce((a, n) => ({ ...a, [n.id]: n }), {})
      this.pieces = ownedObjects.reduce((a, n) => ({ ...a, [n.id]: n }), {})
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
    nftPieceIds: (state) => Object.keys(state.pieces).map(Number),
    getNftById: (state) => (id: number) => state.nfts[id],
    getNftMarketById: (state) => (id: number) => state.markets[id],
    getPieceById: (state) => (id: number) => state.pieces[id],
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

        const v = CACHE[k] as number

        return v || v === 0 ? v : null
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
