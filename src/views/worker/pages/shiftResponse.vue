<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";

const shiftChangeRecords = ref([]);
const showOnlyPending = ref(false);

const fetchShiftChangeRecords = () => {
  axios.get('/api/shift/change-shift-record')
      .then(response => {
        if (response.data && response.data.code === 200) {
          let data = response.data.data.map(record => ({
            id: record.id,
            requestPersonId: record.request_person_id,
            weekId1: record.week_id1,
            weekId2: record.week_id2,
            shiftId1: record.shift_id1,
            shiftId2: record.shift_id2,
            status: record.type === 'NOT_PROCEED' ? '未处理' : (record.type === 'PASS' ? '已同意' : '已拒绝'),
            reviewSelection: null  // 用于保存审核选择
          }));
          if (showOnlyPending.value) {
            data = data.filter(record => record.status === '未处理');
          }
          shiftChangeRecords.value = data;
        }
      })
      .catch(error => {
        console.error('获取换班记录出错:', error);
      });
};

const columns = [
  { title: '编号', dataIndex: 'id', key: 'id', width: 50 },
  { title: '原始周期', dataIndex: 'weekId1', key: 'weekId1', width: 100 },
  { title: '原始班次', dataIndex: 'shiftId1', key: 'shiftId1', width: 100 },
  { title: '换班对象ID', dataIndex: 'requestPersonId', key: 'requestPersonId', width: 100 },
  { title: '换班周期', dataIndex: 'weekId2', key: 'weekId2', width: 100 },
  { title: '换班班次', dataIndex: 'shiftId2', key: 'shiftId2', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 250,
    // 使用插槽的名称
  },
];

const handleReviewConfirm = async (record) => {
  try {
    const result = record.reviewSelection === '通过' ? 1 : 0;
    let params = new URLSearchParams();
    params.append('record_id', parseInt(record.id));
    params.append('result', result);

    const response = await axios.post('/api/shift/review-change-shift', params);

    if (response.data && response.data.code === 200) {
      fetchShiftChangeRecords();
    } else {
      console.error('审核失败:', response.data.message);
    }
  } catch (error) {
    console.error('审核请求发送异常:', error);
  }
};


onMounted(fetchShiftChangeRecords);
</script>
<template>
  <div style="display: flex; justify-content: flex-end">
    <a-button @click="toggleShowPending" type="primary" size="large" style="margin-bottom: 10px;color: white">
      <p v-if="showOnlyPending"> 仅显示未处理记录 </p>
      <p v-else> 显示所有记录 </p>
    </a-button>
  </div>
  <div>
    <a-table :columns="columns" :data-source="shiftChangeRecords" :pagination="{ pageSize: 6 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <span>
            <a-select v-if="record.status === '未处理'" v-model:value="record.reviewSelection" style="width: 100px;">
              <a-select-option :value="'通过'">通过</a-select-option>
              <a-select-option :value="'不通过'">不通过</a-select-option>
            </a-select>
            <a-button v-if="record.status === '未处理'" @click="() => handleReviewConfirm(record)" type="primary">
              提交
            </a-button>
          </span>
        </template>
        <!-- 其他列的模板处理 -->
      </template>
    </a-table>
  </div>
</template>
