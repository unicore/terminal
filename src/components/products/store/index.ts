import { defineStore } from 'pinia'
import chains from '~/chainsMain'
import { encrypt, decrypt } from 'eos-encrypt';

interface Products {
  [id: number]: any
}

interface ProductsState {
  products: Pallets
}

export const useProductsStore = defineStore('product', {
  state: () =>
    ({
      products: {},
    } as ProductsState),
  actions: {
    async encryptMessage(wif, to, message) {
      return new Promise(async (resolve, reject) => {
         
      console.log(wif, to, message)
      const rootChain = chains.getRootChain()
      let instance = await rootChain.readApi.getInstance()

      let msg = message
      // let msg = btoa(unescape(encodeURIComponent(message)))
      
     
      instance.getAccount(to).then(res => {
        
        let pactivekey = res.permissions.find(el => el.perm_name == "active")
        let pkey = pactivekey.required_auth.keys[0].key
        let encryptedMessage = encrypt(wif, pkey, msg, {maxsize: 10000})
        let decryptedMessage = decrypt(wif, pkey, encryptedMessage)
        resolve(encryptedMessage)
      }).catch(e => reject(e))


      })
    }, 

    async decryptMessage(wif, from, message) {
      return new Promise(async (resolve, reject) => {
        
        const rootChain = chains.getRootChain()
        let instance = await rootChain.readApi.getInstance()
        // let msg = decodeURIComponent(escape(atob(message)));
        let msg = message
        instance.getAccount(from).then(res => {
          
        let pactivekey, pkey, decryptedMessage
        
        try {
          
          pactivekey = res.permissions.find(el => el.perm_name == "active")
          pkey = pactivekey.required_auth.keys[0].key
          decryptedMessage = decrypt(wif, pkey, msg)  
          resolve(decryptedMessage)

        } catch(e) {

          resolve("не удалось расшифровать")

        }
        
            
          }).catch(e => resolve("не удалось расшифровать"))

      })
  }


  },
  getters: {
    // symbols: (state) => Object.keys(state.wallets),
  },
})
