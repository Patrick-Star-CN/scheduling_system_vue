import {createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    user: {
      username: "",
      password: "",
      role: "店员",
      page: "",
      preference: "",
      origin_preference: ""
    },
    store: {
      detail: [{
        store_id: "",
        name: "",
        address: "",
        size: 0
      }]
    },
    user_detail: {
      group_id: 1,
      group_manager_name: "manager1",
      manager_name: "manager1",
      name: "manager1",
      store_address: "杭州",
      store_id: 1,
      store_name: "总店",
      type: "MANAGER",
      user_id: 3
    },
    role: {
      "MANAGER": "经理",
      "SUPER_ADMIN": "系统管理员",
      "VICE_MANAGER":"副经理",
      "GROUP_MANAGER":"小组长",
      "STORAGE": "库房",
      "CASHIER": "收银",
      "CUSTOMER_SERVICE": "导购"
    },
    dialogTableVisible: false,
    editTableVisible: true
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
  plugins: [
    // 把vuex的数据存储到sessionStorage
    createPersistedState(),
  ]
})
