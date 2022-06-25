import { ChainsSingleton } from 'unicore'
import config from './config'

const instance = new ChainsSingleton()
instance.init(config)

export default instance
