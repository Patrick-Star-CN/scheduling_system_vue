<script>
// 先引入echarts
// import * as echarts from "echarts";
// // vue3 引入对应功能
// import { onMounted, ref } from "vue";
import axios from "axios";
export default {
  props:{
    user_detail:Object,
    role:Object
  },
  data() {
    return {
      currentPage: 1,  // 当前页码
      pageSize: 3,     // 每页显示的消息数量
      messages: [],
    };
  },
  methods: {
    //...其他方法...
    getMessages() {
      axios.get('/api/message')
          .then(response => {
            this.messages = response.data.data; // 假设响应数据是消息列表
          })
          .catch(error => {
            console.error('Error fetching messages:', error);
          });
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
    },
  },
  computed: {
    // 计算当前页的消息
    currentMessages() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.messages.slice(start, end);
    }
  },
  created() {
     this.getMessages();
  }
};
</script>

<template>
  <a-row :gutter="[72,24]">
    <a-col :span="8">
      <a-card class="card" hoverable>
        <a-card-grid style="width: 40%;text-align: center;background-color: #1482f0">
          <UserOutlined style="color: white;font-size: 50px"/>
        </a-card-grid>
        <a-card-grid style="width: 60%;text-align: right;background-color: #F2F6FC">
          姓名：
          <div style="font-weight: bold;color: #303133">
            {{user_detail.name}}
          </div>
        </a-card-grid>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card class="card" hoverable>
        <a-card-grid style="width: 40%;text-align: center;background-color: #E6A23C">
          <StarOutlined style="color: white;font-size: 50px"/>
        </a-card-grid>
        <a-card-grid style="width: 60%;text-align: right;background-color: #F2F6FC">
          身份：
          <div style="font-weight: bold;color: #303133">
            {{role[user_detail.type]}}
          </div>
        </a-card-grid>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card class="card" hoverable>
        <a-card-grid style="width: 40%;text-align: center;background-color: #F56C6C">
          <BulbOutlined style="color: white;font-size: 50px"/>
        </a-card-grid>
        <a-card-grid style="width: 60%;text-align: right;background-color: #F2F6FC">
          所属的门店：
          <div style="font-weight: bold;color: #303133">
            {{user_detail.store_name}}
          </div>
        </a-card-grid>
      </a-card>
    </a-col>

    <a-col :span="22">
      <div :style="{ display: 'flex', flexDirection: 'row' }">
        <!-- 日历 -->
        <div :style="{ border: '1px solid #d9d9d9', borderRadius: '4px', marginRight: '20px' }">
          <a-calendar v-model:value="value" :fullscreen="false" @panelChange="onPanelChange"/>
        </div>

        <!-- 消息 -->
        <div :style="{ flexGrow: 1 }">
          <!-- 使用 currentMessages 替代 messages -->
          <a-col v-for="(message, index) in currentMessages" :key="index">
            <a-card class="message-card" :style="{ borderColor: message.read === 0 ? 'black' : 'grey' }">
              <div class="message-content" :style="{ color: message.read === 0 ? 'black' : 'grey' }">
                {{ message.message }}
              </div>
            </a-card>
          </a-col>
          <!-- 分页组件 -->
          <a-pagination :current="currentPage" :total="messages.length" :pageSize="pageSize" @change="handlePageChange"/>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<style scoped>
.chartSection {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
<style scoped>
/* 消息卡片样式 */
.message-card {
  margin-bottom: 20px; /* 卡片间的间隔 */
  border-radius: 8px; /* 卡片圆角 */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); /* 卡片阴影 */
  transition: 0.3s; /* 鼠标悬浮动画效果 */
  width: 500px;
}

/* 当鼠标悬浮在卡片上时的样式 */
.message-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

/* 消息内容样式 */
.message-content {
  padding: 10px 16px; /* 内部填充 */
  font-size: 14px; /* 字体大小 */
  line-height: 1.5; /* 行高 */
  /* 颜色的实际设置将由 :style 绑定处理 */
}

/* 页面主要布局样式 */
.main {
  height: 100%;
  width: 100%;
}

/* 侧边栏样式 */
.a-layout-sider {
  background-color: #f0f2f5; /* 侧边栏背景色 */
}

/* 头部样式 */
.a-layout-header {
  background-color: #fff; /* 头部背景色 */
  padding: 0 20px; /* 头部内部填充 */
}

/* 内容区域样式 */
.a-layout-content {
  background-color: #fff; /* 内容区域背景色 */
  padding: 20px; /* 内容区域内部填充 */
  min-height: 280px; /* 最小高度 */
}

/* ...其他可能的样式... */
</style>
