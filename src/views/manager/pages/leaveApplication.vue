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
            recordId: record.record_id,
            date: record.leave_time,
            shift: shifts[record.schedule_shift], // 使用数组索引来获取班次
            status: record.type === 'NOT_PROCEED' ? '待审核' : (record.type === 'PASS' ? '已通过' : '已拒绝'),
            approvalTime:  record.reviewTime ? new Date(record.reviewTime).toLocaleString() : '—'
          }));
        }
      })
      .catch(error => {
        console.error('Error fetching leave records:', error);
      });
};
const submitLeaveRecord = () => {
  // 获取班次的索引
  const shiftIndex = shifts.indexOf(selectedShift.value);

  axios.post('/api/leave/add', {
    leaveTime: leaveDate.value, // 从 DatePicker 获取的请假日期
    scheduleShift: shiftIndex, // 发送班次的索引而不是字符串
  })
      .then(response => {
        console.log('提交响应:', response); // 输出响应数据

        if (response.data && response.data.code === 200) {
          // 如果添加成功，执行相应的操作，如通知用户、更新列表等
          fetchLeaveRecords();
          hideLeaveModal();
        } else {
          // 如果添加失败，处理错误情况
          console.error('添加失败:', response);
        }
      })
      .catch(error => {
        // 如果请求失败，处理错误情况
        console.error('Error submitting leave record:', error);
        console.log('提交错误详情:', error.response); // 输出详细错误信息
      });
};





// 修改后的 Delete 函数
const Delete = (column, record) => {
  axios.delete(`/api/leave/${record.recordId}`) // 使用 record_id 而非 id
      .then(() => {
        // 删除成功后的处理
        const index = leaveRecords.value.findIndex(x => x.recordId === record.recordId);
        if (index !== -1) {
          leaveRecords.value.splice(index, 1);
        }
      })
      .catch(error => {
        console.error('Error deleting record:', error);
      });
};


// 定义表格列
const columns = [
  {
    title: '编号',
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



</script>



<template>
  <div style="display: flex;justify-content: flex-end">
    <Button @click="showLeaveModal" size="large" style="margin-bottom: 10px;background-color: #67C23A;color: white">+增加请假记录</Button>
  </div>
  <div>
    <a-table :columns="columns" :data-source="leaveRecords" :pagination="{ pageSize: 6 }">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'id'">
          {{ index + 1 }} <!-- 显示从1开始的编号 -->
        </template>
        <template v-else-if="column.key === 'action'">
    <span>
      <Divider type="vertical"/>
      <a-button v-if="record.status === '待审核'" style="background-color:#F56C6C;color: white" @click="Delete(column, record)">
        <MinusOutlined />
        删除请假记录
      </a-button>
    </span>
        </template>
        <!-- 此处可以添加其他列的条件渲染 -->
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
