import EosioContract from './contracts/eosio'
import CoreContract from './contracts/core'
import PartnersContract from './contracts/partners'
import { ChainConfig, TableCodeConfig } from './types'
import ReadApi from './readApi'

class Chain {
  private name: string
  public readApi: ReadApi
  private tableCodeConfig: TableCodeConfig

  public eosioContract: EosioContract
  public coreContract: CoreContract
  public partnersContract: PartnersContract

  constructor(chainConfig: ChainConfig, tableCodeConfig: TableCodeConfig) {
    this.name = chainConfig.name
    this.tableCodeConfig = { ...tableCodeConfig, ...(chainConfig.tableCodeConfigOverride || {}) }
    this.readApi = new ReadApi(this.name, chainConfig.rpcEndpoints, chainConfig.balancingMode)

    this.eosioContract = new EosioContract(this.readApi, this.tableCodeConfig)
    this.coreContract = new CoreContract(this.readApi, this.tableCodeConfig)
    this.partnersContract = new PartnersContract(this.readApi, this.tableCodeConfig)
  }
}

export default Chain
