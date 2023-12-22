import { createStore } from 'vuex'

export default createStore({
  state: {
    user:{
      username:"",
      password:"",
      role:"店员",
      page:"",
      preference: "",
      origin_preference:""
    },
    dialogTableVisible:false
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
