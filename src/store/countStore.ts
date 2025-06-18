// src/stores/useCounterStore.ts
import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
}

export interface CounterState {
  count: number
  user: User | null
  dialog: Boolean
}

export const useCounterStore = defineStore('counter', {
  state: (): CounterState => ({
    count: 0,
    user: null,
    dialog: false
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
    handelDialog(){
      this.dialog = !this.dialog
      console.log("执行了")
      console.log(this.dialog)
    },
    async fetchUser() {

    }
  }
})
