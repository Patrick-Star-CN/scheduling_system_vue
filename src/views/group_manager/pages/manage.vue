<script>
import {useStore} from "vuex";
import axios from "axios";
import {message} from "ant-design-vue";
import router from "@/router";

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
        name: "",
        group_id: ""
      },
      edit_open: false,
      detail: '',
      group: ''
    }
  },
  methods: {
    Delete(column, record) {
      console.log(column, record)
      axios.delete('/api/user/group/' + record.user_id, {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              message.success('删除成功！');
              this.reload()
            }
            else if(response.data.data.code===10001){
              router.push("/")
              message.warn("登录过期")
            }
            else {
              message.error('删除失败！');
              this.reload()
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });

    },
    edit(column, record) {
      this.edit_employee = record
      this.edit_open = true
    },
    editCancel() {
      this.reload()
    },
    editOk() {
      this.edit_open = false;
      axios.put('/api/user/group', {
        user_id: this.edit_employee.user_id,
        name: this.edit_employee.name,
        group_id: this.edit_employee.group_id
      })
          .then(response => {
            console.log(response.data)
            this.data = response.data;
            if (this.data.msg === "success") {
              message.success('修改成功！');
              this.reload()
            }
            else if(response.data.data.code===10001){
              router.push("/")
              message.warn("登录过期")
            }
            else {
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
      axios.get('/api/user/group', {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              this.detail = this.data.data;
              console.log(this.detail);
            }
            else if(this.data.data.code===10001){
              router.push("/")
              message.warn("登录过期")
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
    get_group() {
      axios.get('/api/group/employee', {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              this.gruop = this.data.data;
              console.log(this.gruop);
            }
            else if(this.data.data.code===10001){
              router.push("/")
              message.warn("登录过期")
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    }
  },
  created() {
    this.get_employee();
    this.get_group();
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

  <a-modal title="修改信息" v-model:open="edit_open" @ok="editOk" okText="保存"
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
          label="所属组别"
          name="group_id"
          :rules="[{ required: true, message: '请输入所属的组别!' }]"
      >
        <a-select v-model:value="edit_employee.group_id">
          <a-select-option v-for="item in this.group" :key="item.id"
                           :value="item.name">
            {{item.name}}}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>