<script setup>
import { ref } from 'vue';


//
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
    dataIndex: 'name',
    key: 'name',
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
    width: 250,
    // 使用插槽的名称
    slots: { customRender: 'action' },
  },
];
// 假数据
const leaveRecords = ref([
  {
    id: 1,
    date: '2024-01-10',
    name: 'cashier1',
    shift: '08:00 - 12:00',
    status: '待审核',
    approvalTime: '—',
    reviewSelection: '通过', // 默认选项，可以为空字符串或者默认选项
  },
  {
    id: 2,
    date: '2024-01-11',
    shift: '12:00 - 16:00',
    name: 'cashier2',
    status: '已通过',
    approvalTime: '2024-01-12',
    reviewSelection: '不通过', // 默认选项，可以为空字符串或者默认选项
  },
  // ...其他记录
]);

// 审核选项
const reviewOptions = ['通过', '不通过'];

// 审核操作
const handleReviewConfirm = (record) => {
  const index = leaveRecords.value.findIndex(x => x.id === record.id);
  if (index !== -1) {
    leaveRecords.value[index].status = record.reviewSelection === '通过' ? '已通过' : '待审核';
    leaveRecords.value[index].approvalTime = record.reviewSelection === '通过' ? new Date().toISOString() : '—';
  }
};
</script>

<template>
  <a-table :columns="columns" :data-source="leaveRecords" :pagination="{ pageSize: 6 }">
    <!-- 自定义操作列 -->
    <template #action="{ record }">
      <span v-if="record.status === '待审核'">
        <a-select v-model:value="record.reviewSelection" style="width: 100px;">
          <a-select-option v-for="option in reviewOptions" :key="option" :value="option">
            {{ option }}
          </a-select-option>
        </a-select>
        <a-button @click="() => handleReviewConfirm(record)" type="primary">
          审核
        </a-button>
      </span>
    </template>
  </a-table>
</template>

<style scoped>
.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: inline-block;
  margin-right: 10px;
}
</style>
