<template>
  <a-layout class="main">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible width="250">
      <div class="logo">
        门店管理系统
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1" @click="change_page('home')">
          <user-outlined/>
          <span>个人首页</span>
        </a-menu-item>
        <a-menu-item key="2" @click="change_page('edit')">
          <EditOutlined/>
          <span>修改密码</span>
        </a-menu-item>
        <a-menu-item key="3" @click="change_page('schedule')">
          <MonitorOutlined/>
          <span>查看排班信息</span>
        </a-menu-item>
        <a-menu-item key="4" @click="change_page('preference')">
          <HeartOutlined/>
          <span>用户偏好</span>
        </a-menu-item>
        <a-menu-item key="5" @click="change_page('leaveApplication')">
          <ToolOutlined/>
          <span>申请请假</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-flex wrap="wrap" gap="small" justify="flex-end" align="center" style="height: 100%">
          <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)"/>
          <a-breadcrumb style="font-size: 15px">
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item v-if="false">个人中心</a-breadcrumb-item>
          </a-breadcrumb>
          <SearchOutlined class="top"/>
          <ExpandAltOutlined class="top-right"/>
          <FontSizeOutlined class="top-right" style="padding-right: 10px"/>
          <a-avatar shape="square" size="large">
            <template #icon>
              <UserOutlined/>
            </template>
          </a-avatar>
          <span style="font-size: 15px">{{ user.username }}</span>
          <a-dropdown>
            <DownOutlined style="padding-top: 20px;padding-right: 10px"/>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="exit">退出</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-flex>
      </a-layout-header>
      <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px'}"
      >
        <home v-if="user.page==='home'" :user_detail="user_detail" :role="role">
        </home>
        <preference v-if="user.page==='preference'">
        </preference>
        <edit v-if="user.page==='edit'">
        </edit>
        <leave-application v-if="user.page==='leaveApplication'">
        </leave-application>
        <schedule v-if="user.page==='schedule'" :user_detail="user_detail">
        </schedule>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import router from "@/router";
import {message, notification} from "ant-design-vue";
import Home from "@/views/worker/pages/home.vue";
import Preference from "@/views/worker/pages/preference.vue";
import Edit from "@/views/worker/pages/edit.vue";
import LeaveApplication from "@/views/worker/pages/leaveApplication.vue";
import Schedule from "@/views/worker/pages/schedule.vue";
import {useStore} from "vuex";
import axios from "axios";

export default {
  components: {Schedule, LeaveApplication, Edit, Preference, Home},
  setup() {
    const key={
      "home":'1',
      "edit":'2',
      "schedule":'3',
      "preference":'4',
      "leaveApplication":'5',
    }
    const store = useStore()
    const role=store.state.role;
    const user=store.state.user;
    user.page=JSON.parse(sessionStorage.getItem("user")).page
    user.username=JSON.parse(sessionStorage.getItem("user")).username
    user.key=key[user.page]
    console.log(user)
    return {
      user,role
    }
  },
  data() {
    return {
      selectedKeys: [this.user.key],
      collapsed: false,
      user_detail:{}
    }
  },
  methods: {
    exit() {
      router.push("/");
      notification["info"]({
        message: '退出成功',
        description:
            '返回登录界面',
      });
    },
    change_page(name){
      this.user.page=name;
      sessionStorage.setItem("user",JSON.stringify(this.user))
    },
    get_user_detail(){
      axios.get('/api/user', {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              this.user_detail=this.data.data;
              console.log(this.user_detail)
            } else {
              message.warn("查询用户具体信息失败")
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    }
  },
  created() {
    this.get_user_detail()
  }
}
</script>
<style>
#app {
  height: 100%;
  width: 100%;
}

.main {
  height: 100%;
  width: 100%;
}

.trigger {
  font-size: 30px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
  text-align: center;
  color: white;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.site-layout .site-layout-background {
  background: #fff;
}

.top {
  font-size: 30px;
  line-height: 64px;
  margin-left: auto;
}

.top-right {
  padding-left: 10px;
  font-size: 30px;
  line-height: 64px;
}
</style>