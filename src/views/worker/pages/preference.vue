<script>
import Increase from "@/components/increase.vue";
import {useStore} from "vuex";
import axios from "axios";
import {message} from "ant-design-vue";

export default {
  components: {Increase},
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
    let origin_preference="";
    axios.get('/api/preference', {})
        .then(response => {
          console.log(response.data.data.preference_detail)
          user.preference = response.data.data.preference_detail;
          for(let i=0;i<user.preference.length;++i){
            const type=user.preference[i].type;
            const is_like=user.preference[i].is_like;
            const daysArray = user.preference[i].time;
            user.preference[i].type= type==="WORKDAY" ? "工作日偏好" : "班次偏好";
            user.preference[i].is_like= is_like===true ? "喜欢" : "不喜欢";
            user.preference[i].time=daysArray.map(day => dayMap[day]).join("、");
            user.preference[i].id=i+1;
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    return {store, dialogTableVisible, user,origin_preference}
  },
  data() {
    return {
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          key: 'type',
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
      ]
    }
  },
  methods: {
    Delete(column,record) {
      axios.delete('/api/preference', {
        "preference_detail":record.id-1
      })
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              message.success('删除成功！');
              this.reload()
            } else {
              message.error('删除失败！');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      console.log(column,record)
    }
  }
}
</script>
<template>
  <div style="display: flex;justify-content: flex-end">
    <a-button size="large" style="margin-bottom: 10px;background-color: #67C23A;color: white"
              @click="store.state.dialogTableVisible = true">
      <PlusOutlined/>
      增加信息
    </a-button>
  </div>
  <a-table :columns="columns" :data-source="user.preference" :pagination="{ pageSize: 6 }">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'tags'">
        <span>
          <a-tag
              v-for="tag in record.tags"
              :key="tag"
              :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-button type="primary">
            <FormOutlined/>
            修改信息
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
</template>

<style scoped>

</style>