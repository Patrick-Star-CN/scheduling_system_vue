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
          <span>修改个人信息</span>
        </a-menu-item>
        <a-menu-item key="3" @click="change_page('add')">
          <PlusCircleOutlined />
          <span>增加用户信息</span>
        </a-menu-item>
        <a-menu-item key="4" @click="change_page('addStoreRelu')">
          <PlusSquareOutlined />
          <span>增加门店信息</span>
        </a-menu-item>
        <a-menu-item key="5" @click="change_page('schedule')">
          <MonitorOutlined/>
          <span>查看排班</span>
        </a-menu-item>
        <a-menu-item key="6" @click="change_page('flow')">
          <FormOutlined />
          <span>导入客流信息</span>
        </a-menu-item>
        <a-menu-item key="7" @click="change_page('profession')">
          <UserSwitchOutlined />
          <span>管理工种信息</span>
        </a-menu-item>
        <a-menu-item key="8" @click="change_page('leaveApplication')">
          <PlusCircleOutlined />
          <span>审核请假记录</span>
        </a-menu-item>
        <a-menu-item key="9" @click="change_page('review')">
          <SearchOutlined />
          <span>审核请假</span>
        </a-menu-item>
        <a-menu-item key="10" @click="change_page('group')">
          <PlusSquareOutlined />
          <span>管理组别信息</span>
        </a-menu-item>
        <a-menu-item key="11" @click="change_page('manage')">
          <UserSwitchOutlined/>
          <span>人员管理</span>
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
          <div class="top" id="generate" v-if="user.page==='schedule'">
            <span style="font-weight: bold;color: #337ecc">生成排班</span>
            <FieldTimeOutlined  @click="generate_shift"/>
          </div>
          <div class="top">
            <a-avatar shape="square" size="large">
              <template #icon>
                <UserOutlined/>
              </template>
            </a-avatar>
          </div>
          <span style="font-size: 15px">{{ user.username }}</span>
          <a-dropdown>
            <DownOutlined style="padding-right: 30px"/>
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
        <edit v-if="user.page==='edit'">
        </edit>
        <add v-if="user.page==='add'">
        </add>
        <add-store-relu v-if="user.page==='addStoreRelu'">
        </add-store-relu>
        <schedule v-if="user.page==='schedule'" :user_detail="user_detail" :refresh="refresh">
        </schedule>
        <flow v-if="user.page==='flow'">
        </flow>
        <profession v-if="user.page==='profession'">
        </profession>
        <leaveApplication v-if="user.page==='leaveApplication'">
        </leaveApplication>
        <review v-if="user.page==='review'">
        </review>
         <group v-if="user.page==='group'">
        </group>
        <manage v-if="user.page==='manage'">
        </manage>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import router from "@/router";
import {message, notification} from "ant-design-vue";
import Home from "@/views/manager/pages/home.vue";
import Edit from "@/views/manager/pages/edit.vue";
import {useStore} from "vuex";
import Add from "@/views/manager/pages/add.vue";
import Review from "@/views/manager/pages/review.vue";
import LeaveApplication from "@/views/manager/pages/leaveApplication.vue";
import axios from "axios";
import AddStoreRelu from "@/views/manager/pages/addStoreRelu.vue";
import Schedule from "@/views/manager/pages/schedule.vue";
import Flow from "@/views/manager/pages/flow.vue";
import Profession from "@/views/manager/pages/profession.vue";
import Group from "@/views/manager/pages/group.vue";
import Manage from "@/views/manager/pages/manage.vue";

export default {
  inject:["reload"],
  components: {Review, Profession, Group, Flow, Schedule, AddStoreRelu, Add,Edit, Home, LeaveApplication, Manage},
  setup() {
    const key={
      "home":'1',
      "edit":'2',
      'add':'3',
      "addStoreRelu":'4',
      "schedule":'5',
      "flow":'6',
      "profession":'7',
      'leaveApplication':'8',
      "review":'9',
      "group":"10",
      'manage': '11'
    }
    const store = useStore()
    const role=store.state.role;
    const user=store.state.user;
    let user_detail=store.state.user_detail;
    user.page=JSON.parse(sessionStorage.getItem("user")).page
    user.username=JSON.parse(sessionStorage.getItem("user")).username
    if(JSON.parse(sessionStorage.getItem("user_detail"))!=null){
      user_detail=JSON.parse(sessionStorage.getItem("user_detail"))
    }
    user.key=key[user.page]
    return {
      user,role,user_detail
    }
  },
  data() {
    return {
      selectedKeys: [this.user.key],
      collapsed: false,
      refresh:false,
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
              sessionStorage.setItem("user_detail",JSON.stringify(this.user_detail))
            }
            else if(this.data.data.code===10001){
              router.push("/")
            }
            else {
              message.warn("查询用户具体信息失败")
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
    generate_shift(){
      this.refresh=true;
      axios.post('/api/shift/'+this.user_detail.store_id, {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              notification["success"]({
                message: '生成排班情况',
                description:
                    '自动生成排班成功',
              });
              this.reload()
            } else {
              notification["error"]({
                message: '生成排班情况',
                description:
                    '自动生成排班失败',
              });
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
#generate{
  padding-right: 10px;
  color: #337ecc;
  animation-iteration-count: infinite;
}
#generate:hover{
  cursor: pointer;
}
@keyframes example {
  0%   {color: red;}
  25%  {color: orange;}
  50%  {color: deeppink;}
  100% {color: pink;}
}
</style>