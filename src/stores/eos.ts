import { defineStore } from 'pinia'

export const useEosStore = defineStore('eos', {
  state: () => ({}),
  actions: {
    execute(...args: string[]) {
      console.log(args)
    },
  },
})
