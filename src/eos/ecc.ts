import { ecc } from 'eosjs/dist/eosjs-ecc-migration'
import { PublicKey, PrivateKey } from 'eosjs/dist/eosjs-jssig'

export const isValidWif = (wif: string) => ecc.isValidPrivate(wif)

export const wifToPrivateKey = (wif: string) => PrivateKey.fromString(wif)

export const privateKeyToPublic = (privateKey: PrivateKey) => privateKey.getPublicKey()

export const hdPublicToEccPublicKey = (hdPublicKey: string) => PublicKey.fromString(hdPublicKey)
