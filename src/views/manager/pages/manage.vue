<script>
import {useStore} from "vuex";
import axios from "axios";
import {message} from "ant-design-vue";

export default {
  inject: ["reload"],
  setup() {
    const store = useStore();
    const user = store.state.user
    const Store = store.state.store
    return {store, user, Store}
  },

  data() {
    return {
      columns: [
        {
          title: '员工工号',
          dataIndex: 'user_id',
          key: 'user_id',
        },
        {
          title: '员工姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '工种名称',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '组别编号',
          dataIndex: 'group_id',
          key: 'group_id',
        },
        {
          title: '组别名称',
          dataIndex: 'group_name',
          key: 'group_name',
        },
        {
          title: '操作',
          key: 'action',
        },
      ],
      edit_employee: {
        user_id: "",
        type:"",
        group_id: ""
      },
      edit_open: false,
      detail: ''
    }
  },
  methods: {
    edit(column, record) {
      this.edit_employee = record;
      this.edit_open = true;
      if(this.edit_employee.type === "CASHIER")
        this.get_CASHIERGroup();
      if(this.edit_employee.type === "CUSTOMER_SERVICE")
        this.get_CUSTOMERSERVICEGroup();
      if(this.edit_employee.type === "STORAGE")
        this.get_STORAGEGroup();
    },
    editCancel() {
      this.reload()
    },
    editOk() {
      this.edit_open = false;
      axios.put('/api/user/profession/{user_id}/{type}/${group_id}', {
        user_id: this.edit_employee.user_id,
        type:  this.edit_employee.type,
        group_id: this.edit_employee.group_id
      })
          .then(response => {
            console.log(response.data)
            this.data = response.data;
            if (this.data.msg === "success") {
              message.success('修改成功！');
              this.reload()
            } else {
              message.error('修改失败！');
              this.reload()
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      this.edit_open = !this.edit_open
    },
    get_employee() {
      axios.get('/api/user/store/worker', {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              this.detail = this.data.data;
              console.log(this.detail);
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
    get_group() {
      axios.get('/api/group/employee/{type}', {
        type: this.edit_employee.type
      })
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              this.group = this.data.data;
              console.log(this.group);
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
    get_CASHIERGroup() {
      axios.get('/api/group/employee/CASHIER', {
      })
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              this.group = this.data.data;
              console.log(this.group);
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
    get_CUSTOMERSERVICEGroup() {
      axios.get('/api/group/employee/CUSTOMER_SERVICE', {
      })
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              this.group = this.data.data;
              console.log(this.group);
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
    get_STORAGEGroup() {
      axios.get('/api/group/employee/STORAGE', {
      })
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              this.group = this.data.data;
              console.log(this.group);
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    }
  },
  created() {
    this.get_employee();
    this.get_CASHIERGroup();
  }
}
</script>
<template>
  <a-table :columns="columns" :data-source="this.detail" :pagination="{ pageSize: 6 }">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a-button type="primary" @click="edit(column,record)">
            <FormOutlined/>
            <span>修改工种-组别架构</span>
          </a-button>
          <a-divider type="vertical"/>
        </span>
      </template>
    </template>
  </a-table>

  <a-modal title="修改工种-组别架构" v-model:open="edit_open" @ok="editOk" okText="保存"
           @cancel="editCancel" cancelText="退出">
    <a-form
        :model="edit_employee"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
    >
      <a-form-item
          label="员工工号"
          name="user_id"
          :rules="[{ required: true, message: '请输入员工的工号!' }]"
      >
        <a-input-number id="inputNumber" style="width: 100%" v-model:value="edit_employee.user_id" :min="1"
                        :max="100000" disabled="disabled"/>
      </a-form-item>
      <a-form-item
          label="员工姓名"
          name="name"
          :rules="[{ required: true, message: '请输入员工的姓名!' }]"
      >
        <a-input-number v-model:value="edit_employee.name" disabled="disabled" style="width: 100%" />
      </a-form-item>
      <a-form-item
          label="所属工种"
          name="type"
          :rules="[{ required: true, message: '请输入所属的工种名称!' }]"
      >
        <a-radio-group v-model:value="edit_employee.type" button-style="solid">
          <a-radio-button value="CASHIER" @click="get_CASHIERGroup">收银</a-radio-button>
          <a-radio-button value="CUSTOMER_SERVICE" @click="get_CUSTOMERSERVICEGroup">导购</a-radio-button>
          <a-radio-button value="STORAGE" @click="get_STORAGEGroup">库房</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
          label="所属组别"
          name="group_id"
          :rules="[{ required: true, message: '请输入所属的组别id!' }]"
      >
        <a-select v-model:value="edit_employee.group_id">
          <a-select-option v-for="item in group" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>