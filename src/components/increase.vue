<script>
import {useStore} from "vuex";
import axios from "axios";
import {message} from "ant-design-vue";
// import {notification} from "ant-design-vue";
// import Cookies from "js-cookie";
// import {encrypt} from "@/utils/jsencrypt";
// import router from "@/router";

export default {
  setup() {
    const store = useStore();
    const dialogTableVisible = store.state.dialogTableVisible
    return {store, dialogTableVisible}
  },
  inject:["reload"],
  data() {
    return {
      open: true,
      choices: "",
      workday: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期七"],
      Schedules:["上午","下午","晚上"],
      day_map:{
        "星期一":1,
        "星期二":2,
        "星期三":3,
        "星期四":4,
        "星期五":5,
        "星期六":6,
        "星期七":7
      },
      schedule_map:{
        "上午": 0,
        "下午":1,
        "晚上":2
      },
      is_like:"true",
      preference_day:1,
      preference_schedule:0
    }
  },
  methods: {
    handleOk() {
      this.store.state.dialogTableVisible = false
      if(typeof this.preference_day==="number"){
        this.preference_day=[this.preference_day]
      }
      if(typeof this.preference_schedule==="number"){
        this.preference_schedule=[this.preference_schedule]
      }
      axios.post('/api/preference', {
        type:this.choices,
        time:this.choices==="WORKDAY" ? this.preference_day : this.preference_schedule,
        is_like:this.is_like === "true"
      })
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              message.success('添加成功！');
              this.reload()
            } else {
              message.error('添加失败！');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
    onChangeRangeDate(value, dateString) {
      this.preference.time[0] = dateString[0];
      this.preference.time[1] = dateString[1];
    },
  }
}
</script>

<template>
  <a-modal title="增添信息" v-model:open="store.state.dialogTableVisible" @ok="handleOk" okText="确认"
           cancelText="退出">
    <a-form
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off">
      <a-form-item
          label="偏好类型选择"
          name="preference"
      >
        <a-select v-model:value="choices">
          <a-select-option value="WORKDAY">工作日偏好</a-select-option>
          <a-select-option value="SHIFT">班次偏好</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
          label="工作日偏好"
          name="preference"
          v-if="choices==='WORKDAY'"
      >
        <a-select v-model:value="preference_day" mode="multiple">
          <a-select-option v-for="day in workday" :key="day" :value="day_map[day]">{{day}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
          label="工作日偏好"
          name="preference"
          v-else
      >
        <a-select disabled="disabled">
        </a-select>
      </a-form-item>
      <a-form-item
          label="班次偏好"
          name="preference"
          v-if="choices==='SHIFT'"
      >
        <a-select mode="multiple" v-model:value="preference_schedule">
          <a-select-option v-for="schedule in Schedules" :key="schedule" :value="schedule_map[schedule]">{{ schedule }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
          label="班次偏好"
          name="preference"
          v-else
      >
        <a-select disabled="disabled">
        </a-select>
      </a-form-item>
      <a-form-item
          label="偏好"
          name="preference"
      >
        <a-radio-group v-model:value="is_like" name="radioGroup">
          <a-radio value="true">希望安排</a-radio>
          <a-radio value="false">不希望安排</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>