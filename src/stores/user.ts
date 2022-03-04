import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    counter: 0,
    hasAuth: false,
  }),
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    },
    login() {
      this.hasAuth = true
    },
    logout() {
      this.hasAuth = false
    },
  },
})
