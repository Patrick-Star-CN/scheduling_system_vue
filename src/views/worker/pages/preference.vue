<script>
import Increase from "@/components/increase.vue";
import {useStore} from "vuex";
import axios from "axios";
import {message} from "ant-design-vue";
import router from "@/router";

export default {
  components: {Increase},
  inject:["reload"],
  setup() {
    const store = useStore();
    const user = store.state.user
    const dialogTableVisible = store.state.dialogTableVisible
    const dayMap = {
      1: "星期一",
      2: "星期二",
      3: "星期三",
      4: "星期四",
      5: "星期五",
      6: "星期六",
      7: "星期七",
    };
    const schedule_map={
          0:"上午",
          1:"下午",
          2:"晚上"
    };
    let origin_preference = "";
    axios.get('/api/preference', {})
        .then(response => {
          user.preference = response.data.data.preference_detail;
          for (let i = 0; i < user.preference.length; ++i) {
            const type = user.preference[i].type;
            const is_like = user.preference[i].is_like;
            const daysArray = user.preference[i].time;
            user.preference[i].type = type === "WORKDAY" ? "工作日偏好" : "班次偏好";
            user.preference[i].is_like = is_like === true ? "喜欢" : "不喜欢";
            user.preference[i].time = type==="WORKDAY" ?daysArray.map(day => dayMap[day]).join("、") : daysArray.map(day => schedule_map[day]).join("、")
            user.preference[i].id = i + 1;
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    return {store, dialogTableVisible, user, origin_preference}
  },

  data() {
    return {
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '时间段',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '喜欢/不喜欢',
          dataIndex: 'is_like',
          key: 'preference',
        },
        {
          title: '操作',
          key: 'action',
        },
      ],
      edit_open: false,
      workday: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期七"],
      Schedules:["上午","下午","晚上"],
      day_map: {
        "星期一": 1,
        "星期二": 2,
        "星期三": 3,
        "星期四": 4,
        "星期五": 5,
        "星期六": 6,
        "星期七": 7
      },
      schedule_map:{
        "上午": 0,
        "下午":1,
        "晚上":2
      },
      is_like: "true",
      edit_choose: {
        id: "",
        choices: "WORKDAY",
        preference_day: 1,
        is_like: "true"
      }
    }
  },
  methods: {
    Delete(column, record) {
      axios.delete('/api/preference/' + (record.id - 1).toString(), {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              message.success('删除成功！');
              this.reload()
            }
            else if(this.data.data.code===10001){
              router.push("/")
              message.warn("登录过期")
            }
            else {
              message.error('删除失败！');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      console.log(column, record)
    },
    edit(column, record) {
      this.edit_choose.id = record.id
      this.edit_open = !this.edit_open
    },
    editOk() {
      if (typeof this.edit_choose.preference_day === "number") {
        this.edit_choose.preference_day = [this.edit_choose.preference_day]
      }

      axios.put('/api/preference', {
        old_preference_detail_id: this.edit_choose.id-1,
        new_preference_detail:{
          type:this.edit_choose.choices,
          time:this.edit_choose.preference_day,
          isLike:this.is_like,
        }
      })
          .then(response => {
            console.log(response.data)
            this.data = response.data;
            if (this.data.msg === "success") {
              message.success('修改成功！');
              this.reload()
            }
            else if(this.data.data.code===10001){
              router.push("/")
              message.warn("Token已被顶下线")
            }
            else {
              message.error('修改失败！');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      this.edit_open = !this.edit_open
    }
  }
}
</script>
<template>
  <div style="display: flex;justify-content: flex-end">
    <a-button size="large" style="margin-bottom: 10px"
              type="primary"
              @click="store.state.dialogTableVisible = true">
      <PlusOutlined/>
      增加信息
    </a-button>
  </div>
  <a-table :columns="columns" :data-source="user.preference" :pagination="{ pageSize: 6 }">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a-button type="primary" @click="edit(column,record)">
            <FormOutlined/>
            <span>修改信息</span>
          </a-button>
          <a-divider type="vertical"/>
          <a-button style="background-color:#F56C6C;color: white" @click="Delete(column,record)">
            <MinusOutlined/>
            删除信息
          </a-button>
        </span>
      </template>
    </template>
  </a-table>
  <increase></increase>
  <a-modal title="修改信息" v-model:open="edit_open" @ok="editOk" okText="保存"
           cancelText="退出">
    <a-form
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off">
      <a-form-item
          label="偏好类型选择"
          name="preference"
      >
        <a-select v-model:value="edit_choose.choices">
          <a-select-option value="WORKDAY">工作日偏好</a-select-option>
          <a-select-option value="SHIFT">班次偏好</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
          label="工作日偏好"
          name="preference"
          v-if="edit_choose.choices==='WORKDAY'"
      >
        <a-select v-model:value="edit_choose.preference_day" mode="multiple">
          <a-select-option v-for="day in workday" :key="day" :value="day_map[day]">{{ day }}</a-select-option>
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
          v-if="edit_choose.choices==='SHIFT'"
      >
        <a-select mode="multiple" v-model:value="edit_choose.preference_day">
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
        <a-radio-group v-model:value="edit_choose.is_like" name="radioGroup">
          <a-radio value="true">希望安排</a-radio>
          <a-radio value="false">不希望安排</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>