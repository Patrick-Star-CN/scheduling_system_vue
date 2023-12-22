<script>
import {useStore} from "vuex";
// import {computed} from "vue";
import router from "@/router";
import {notification} from "ant-design-vue";
import Cookies from "js-cookie";
import {decrypt, encrypt} from "@/utils/jsencrypt";
import axios from "axios";

axios.defaults.withCredentials = true;
export default {
  setup() {
    const store = useStore();
    const user = store.state.user;
    const username = Cookies.get("username");
    const password = Cookies.get("password");
    const role = Cookies.get("role");
    user.username = (username === undefined ? "" : username)
    user.password = (password === undefined ? "" : decrypt(password))
    user.role = (role === undefined ? "店员" : role)
    console.log(user)
    return {
      user
    }
  },
  data() {
    return {
      data: "",
      remember: false,
      loading: false
    }
  },
  methods: {
    //登录函数
    login() {
      this.fetchData();
    },
    fetchData() {
      axios.post('/api/user/login', {username: this.user.username, password: this.user.password})
          .then(response => {
            this.data = response.data;
            if (this.data.msg !== "success") {
              notification["error"]({
                message: '登录失败',
                description:
                    '登录信息填写错误',
              });
            } else {
              this.user.page = 'home'
              this.loading = !this.loading;
              if (this.remember) {
                // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
                Cookies.set("username", this.user.username, {expires: 30});
                Cookies.set("password", encrypt(this.user.password), {expires: 30});
                Cookies.set("role", this.user.role, {expires: 30});
              } else {
                // 否则移除
                Cookies.remove("username");
                Cookies.remove("password");
                Cookies.remove("role");
              }
              const role=this.data.data
              setTimeout(() => {
                if(role==="CASHIER"){
                  router.push("/worker/index")
                }
                else if(role==="SUPER_ADMIN"){
                  router.push("/superManager/index")
                }

                notification["success"]({
                  message: '登录成功',
                  description:
                      this.user.username + '，欢迎来到管理界面',
                });
              }, 1000)
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    }
  }
}
</script>

<template>
  <div class="main">
    <div class="Login">
      <a-form :model="user"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
              autocomplete="off"
              class="menu"
              v-model="user">
        <a-form-item
            :wrapper-col="{ offset:10, span: 10 }"
        >
          <h1 class="title">用户登录</h1>
        </a-form-item>
        <a-form-item
            label="用户名"
            name="username"
            :wrapper-col="{ span: 10 }"
            :rules="[{ required: true, message: '请输入你的用户名!' }]">
          <a-input v-model:value="user.username">
            <template #prefix>
              <UserOutlined style="color: rgba(0, 0, 0, 0.25)"/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
            label="密码"
            name="password"
            :wrapper-col="{ span: 10 }"
            :rules="[{ required: true, message: '请输入你的密码!' }]">
          <a-input-password v-model:value="user.password">
            <template #prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)"/>
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 10 }">
          <a-checkbox v-model:checked="remember">记住密码</a-checkbox>
          <a class="login-form-forgot" href="" style="float: right">忘记密码</a>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset:8, span: 10 }">
          <a-button type="primary" html-type="submit" class="button" @click="login">
            <span v-if="!loading">登录</span>
            <span v-else>
              <sync-outlined spin/>
              登录中
            </span>
          </a-button>
          或者，
          <a href="">点击注册！</a>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<style scoped>
.button {
  width: 100%;
}

.main {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 0;
  background: #6190E8; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #A7BFE8, #6190E8); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #A7BFE8, #6190E8); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}

.Login {
  width: 45%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background-color: #c6e2ff;
  border-radius: 50px;
}

.menu {
}

.title {
  letter-spacing: 5px;
  font-weight: bold;
  color: #337ecc;
}
</style>