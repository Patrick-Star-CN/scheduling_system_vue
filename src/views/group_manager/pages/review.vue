<script setup>
import { ref, onMounted } from 'vue';

import axios from "axios";
import router from "@/router";
import {message} from "ant-design-vue";
const leaveRecords = ref([]);
const showOnlyPending = ref(false); // 用于跟踪是否只显示未审核的记录
// 加载数据的方法
const shifts = ['开店前', '8:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '关店后'];
const toggleShowPending = () => {
  showOnlyPending.value = !(showOnlyPending.value);
  fetchLeaveRecords(); // 重新获取并可能过滤数据
};

const fetchLeaveRecords = () => {
  axios.get('/api/leave/all_review')
      .then(response => {
        if (response.data && response.data.code === 200) {
          let data = response.data.data.map(record => ({
            recordId: record.record_id,
            date: record.leave_time,
            requestPerson: record.request_person,
            reviewerPerson: record.reviewer_person,
            shift: shifts[record.schedule_shift], // 使用数组索引来获取班次
            status: record.type === 'NOT_PROCEED' ? '待审核' : (record.type === 'PASS' ? '已通过' : '已拒绝'),
            type: record.type,
            approvalTime: record.review_time !== '未审核' ? new Date(record.review_time).toLocaleString() : '—'
          }));
          console.log(typeof showOnlyPending.value)
          if (showOnlyPending.value) {
            // 仅保留状态为“待审核”的记录
            data = data.filter(record => record.status === '待审核');
          }

          leaveRecords.value = data;
        }
        else if(response.data.data.code===10001){
          router.push("/")
          message.warn("登录过期")
        }
      })
      .catch(error => {
        console.error('Error fetching leave records:', error);
      });
};

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: '请假日期',
    dataIndex: 'date',
    key: 'date',
    width: 150,
  },
  {
    title: '请假人',
    dataIndex: 'requestPerson',
    key: 'requestPerson',
    width: 150,
  },
  {
    title: '请假班次',
    dataIndex: 'shift',
    key: 'shift',
    width: 150,
  },
  {
    title: '请假状态',
    dataIndex: 'status',
    key: 'status',
    width: 150,
  },
  {
    title: '审核通过时间',
    dataIndex: 'approvalTime',
    key: 'approvalTime',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    dataIndex :'action',
    width: 250,
    // 使用插槽的名称
  },
];


// 审核选项
const reviewOptions = ['通过', '不通过'];

// 审核操作
const handleReviewConfirm = async (record) => {
  try {
    // 向后端发送审核结果
    const response = await axios.post('/api/leave/review', {
      record_id: record.recordId,
      status: record.reviewSelection == '通过'?1:(record.reviewSelection == '不通过'?0:2),
    });

    if (response.data && response.data.code === 200) {
      // 更新前端显示的记录状态
      fetchLeaveRecords();
    } else {
      // 处理后端响应错误
      console.error('审核失败:', response.data.message);
    }
  } catch (error) {
    console.error('审核请求发送异常:', error);
  }
};
onMounted(fetchLeaveRecords);
</script>

<template>
  <div style="display: flex; justify-content: flex-end">
    <a-button @click="toggleShowPending" type="primary" size="large" style="margin-bottom: 10px;color: white">
      <p v-if="showOnlyPending"> 仅显示未审核记录 </p>
      <p v-else> 显示所有审核记录 </p>
    </a-button>
  </div>
  <div>


  <a-table :columns="columns" :data-source="leaveRecords" :pagination="{ pageSize: 6 }">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'id'">
        {{ index + 1 }} <!-- 显示从1开始的编号 -->
      </template>
      <template v-else-if="column.key === 'status'">
        {{ record.status }} <!-- 临时显示状态 -->
      </template>
      <template v-else-if="column.key === 'action'">
    <span>
      <a-select v-if="record.status === '待审核'" v-model:value="record.reviewSelection" style="width: 100px;">
        <a-select-option v-for="option in reviewOptions" :key="option" :value="option">
          {{ option }}
        </a-select-option>
      </a-select>
      <a-button v-if="record.status === '待审核'" @click="() => handleReviewConfirm(record)" type="primary">
        审核
      </a-button>
    </span>
      </template>
    </template>
  </a-table>

</div>
</template>
<style scoped>
.form-item {
  margin-bottom: 15px; /* 调整间距 */
}

.form-item label {
  display: inline-block;
  margin-right: 10px; /* 调整标签与输入框之间的距离 */
}
</style>
