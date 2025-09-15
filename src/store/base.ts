import { defineStore } from 'pinia'

export const useBaseStore = defineStore('base', {
  state: () => ({
    count: 0,
    isMobile: false,
    theme: null
  }),
  getters: {
  },
  actions: {
  }
})
