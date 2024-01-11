<script>

export default {
  props:{
    user_detail:Object,
    role:Object
  },
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
          所在的门店：
          <div style="font-weight: bold;color: #303133">
            {{user_detail.store_name}}
          </div>
        </a-card-grid>
      </a-card>
    </a-col>
    <a-col :span="8">
      <div :style="{ border: '1px solid #d9d9d9', borderRadius: '4px' }">
        <a-calendar v-model:value="value" :fullscreen="false" @panelChange="onPanelChange"/>
      </div>
    </a-col>
  </a-row>
</template>