<script setup>
import { ref, onMounted } from 'vue';
import { DatePicker, Modal, Button, Select, MinusOutlined, Divider } from 'ant-design-vue';
import axios from "axios";

// 请假记录
const leaveRecords = ref([]);

// 加载数据的方法
const shifts = ['开店前', '8:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '关店后'];

const fetchLeaveRecords = () => {
  axios.get('/api/leave/all')
      .then(response => {
        console.log("Received data:", response.data);
        if (response.data && response.data.code === 200) {
          leaveRecords.value = response.data.data.map(record => ({
            id: record.record_id,
            date: record.leave_time,
            shift: shifts[record.schedule_shift], // 使用数组索引来获取班次
            status: record.type === 'NOT_PROCEED' ? '待审核' : (record.type === 'PASS' ? '已通过' : '已拒绝'),
            approvalTime: record.review_time != null ? new Date(record.review_time).toLocaleString() : '—'
          }));
        }
      })
      .catch(error => {
        console.error('Error fetching leave records:', error);
      });
};

// const submitLeaveRecord = () => {
//   // 这里假设后端接受 POST 请求以添加新的请假记录
//   axios.post('/api/leave/add', {
//     date: leaveDate.value,
//     shift: selectedShift.value,
//   })
//       .then(response => {
//         // 处理响应
//         if (response.data && response.data.code === 200) {
//           // 添加成功后，可以选择重新加载数据或直接更新界面
//           fetchLeaveRecords();
//           hideLeaveModal();
//         } else {
//           // 处理错误情况
//           console.error('添加失败:', response);
//         }
//       })
//       .catch(error => {
//         console.error('Error submitting leave record:', error);
//       });
// };
let lastAssignedId = leaveRecords.value.length > 0
    ? Math.max(...leaveRecords.value.map(record => record.id))
    : 0;

const submitLeaveRecord = () => {
  // 创建一个新的记录对象
  const newRecord = {
    id: ++lastAssignedId, // 递增编号
    date: leaveDate.value ? leaveDate.value.toISOString().split('T')[0] : null,
    shift: selectedShift.value, // 使用Select组件的值
    status: '待审核', // 新记录的默认状态
    approvalTime: '—' // 审核时间默认为'—'
  };

  leaveRecords.value.push(newRecord);
  // 重新编号
  reassignIds();
  // 隐藏模态框
  hideLeaveModal();
};
function reassignIds() {
  leaveRecords.value.forEach((record, index) => {
    record.id = index + 1;
  });
}


// const Delete = (column, record) => {
//   axios.delete(`/api/leave/${record.id}`)
//       .then(() => {
//         // 删除成功，从列表中移除该记录
//         const index = leaveRecords.value.findIndex(x => x.id === record.id);
//         if (index !== -1) {
//           leaveRecords.value.splice(index, 1);
//         }
//       })
//       .catch(error => {
//         console.error('Error deleting record:', error);
//       });
// };
const Delete = (column, record) => {
  // 直接在leaveRecords中找到并删除记录
  const index = leaveRecords.value.findIndex(x => x.id === record.id);
  if (index !== -1) {
    leaveRecords.value.splice(index, 1);
    // 重新编号
    reassignIds();
  }
};


// 定义表格列
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    width: 50 // 小一点的宽度，例如100像素
  },
  { title: '请假日期', dataIndex: 'date', key: 'date',width: 150 },
  { title: '请假班次', dataIndex: 'shift', key: 'shift',width: 150 },
  { title: '请假状态', dataIndex: 'status', key: 'status' ,width: 150},
  { title: '审核通过时间', dataIndex: 'approvalTime', key: 'approvalTime',width: 150 },
  {
    title: '操作',
    dataIndex :'action',
    key: 'action',
    width: 250 // 大一点的宽度，例如200像素
  },
];

// 显示或隐藏模态框的状态
const isLeaveModalVisible = ref(false);
const leaveDate = ref('');

const selectedShift = ref(shifts[0]);
const showLeaveModal = () => {
  isLeaveModalVisible.value = true;
};

const hideLeaveModal = () => {
  isLeaveModalVisible.value = false;
};

onMounted(fetchLeaveRecords);
// 初始的假数据
const initialData = [
  {
    id: 1,
    date: '2024-01-01',
    shift: '8:00-10:00',
    status: '待审核',
    approvalTime: '—'
  },
  {
    id: 2,
    date: '2024-01-02',
    shift: '10:00-12:00',
    status: '已通过',
    approvalTime: '2024-01-01 10:00'
  },
  // 更多的假数据记录...
];

// 在mounted时添加初始数据
onMounted(() => {
  leaveRecords.value = initialData;
});


</script>



<template>
  <div style="display: flex;justify-content: flex-end">
    <Button @click="showLeaveModal" size="large" style="margin-bottom: 10px;background-color: #67C23A;color: white">+增加请假记录</Button>
  </div>
  <div>
    <a-table :columns="columns" :data-source="leaveRecords" :pagination="{ pageSize: 6 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
        <span>
          <Divider type="vertical"/>
          <a-button v-if="record.status === '待审核'" style="background-color:#F56C6C;color: white" @click="Delete(column, record)">
            <MinusOutlined />
            删除请假记录
          </a-button>
        </span>
        </template>
      </template>
    </a-table>
    <Modal
        title="请假记录"
        v-model:visible="isLeaveModalVisible"
        @ok="submitLeaveRecord"
        @cancel="hideLeaveModal"
        okText="确认"
        cancelText="取消"
    >
    <div class="form-item">
      <label>选择日期：</label>
      <DatePicker v-model:value="leaveDate" placeholder="选择日期" />
    </div>
    <div class="form-item">
      <label>选择班次：</label>
      <Select v-model:value="selectedShift" placeholder="选择班次" style="width: 150px;">
        <Select.Option v-for="shift in shifts" :key="shift" :value="shift">
          {{ shift }}
        </Select.Option>
      </Select>
    </div>
  </Modal>
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
