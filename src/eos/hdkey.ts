import hdkey from 'hdkey'

export const seedToHd = (seed: string | Buffer) => {
  const isString = typeof seed === 'string'
  const seedBuffer = isString ? Buffer.from(seed, 'hex') : seed

  return hdkey.fromMasterSeed(seedBuffer)
}

export const hdToFirstHdNode = (hd: hdkey) => hd.derive("m/44'/194'/0'/0/0")

export const hdNodeToPublicKey = (hd: hdkey) => hd.publicKey.toString('hex')
