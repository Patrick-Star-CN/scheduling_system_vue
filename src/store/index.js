import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
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
    store:{
      detail:[{
        store_id:"",
        name:"",
        address:"",
        size:0
      }]
    },
    role:{
      "MANAGER":"经理",
      "SUPER_ADMIN":"系统管理员",
      "STORAGE":"库房",
      "Cashier":"收银",
      "CUSTOMER_SERVICE":"导购",
      "VICE_MANAGER":"副经理",
      "GROUP_MANAGER":"小组长"
    },
    dialogTableVisible:false,
    editTableVisible:true
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {

  },
  plugins: [
    // 把vuex的数据存储到sessionStorage
    createPersistedState(),
  ]
})
