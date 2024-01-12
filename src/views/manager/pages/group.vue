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
          title: '组别编号',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '商店编号',
          dataIndex: 'store_id',
          key: 'store_id',
        },
        {
          title: '管理员编号',
          dataIndex: 'manager_id',
          key: 'manager_id',
        },
        {
          title: '组别名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '工种名称',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '操作',
          key: 'action',
        },
      ],
      increase_group: {
        manager_id: "",
        name: "",
        type: ""
      },
      edit_group: {
        id: "",
        store_id: "",
        manager_id: "",
        name: "",
        type: ""
      },
      increase_open: false,
      edit_open: false,
      detail: ''
    }
  },
  methods: {
    Delete(column, record) {
      console.log(column, record)
      axios.delete('/api/group/' + record.id, {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              message.success('删除成功！');
              this.reload()
            } else {
              message.error('删除失败！');
              this.reload()
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });

    },
    edit(column, record) {
      this.edit_group = record
      this.edit_open = true
    },
    editCancel() {
      this.reload()
    },
    editOk() {
      this.edit_open = false;
      axios.put('/api/group', {
        id: this.edit_group.id,
        store_id: this.edit_group.store_id,
        manager_id: this.edit_group.manager_id,
        name: this.edit_group.name,
        type: this.edit_group.type
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
    increaseOk() {
      console.log(this.increase_group)
      if (this.increase_group.manager_id === "" || this.increase_group.name === "" || this.increase_group.type === "") {
        message.error("无法添加，未完整输入信息")
      } else {
        this.increase_open = false;
        console.log(this.increase_group)
        axios.post('/api/group/' + this.increase_group.manager_id + '/' + this.increase_group.name + '/' + this.increase_group.type, {
          manager_id: this.increase_group.manager_id,
          name: this.increase_group.name,
          type: this.increase_group.type
        })
            .then(response => {
              this.data = response.data;
              if (this.data.msg === "success") {
                message.success('添加成功！');
                this.reload()
              } else {
                message.error('添加失败！');
                this.reload()
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
      }
    },
    get_group() {
      axios.get('/api/group', {})
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
    }
  },
  created() {
    this.get_group();
  }
}
</script>
<template>
  <div style="display: flex;justify-content: flex-end">
    <a-button @click="increase_open = true" type="primary" size="large" style="margin-bottom: 10px;color: white">
      <PlusOutlined/>
      增加信息
    </a-button>
  </div>
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
        :model="edit_group"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
    >
      <a-form-item
          label="组别编号"
          name="id"
          :rules="[{ required: true, message: '请输入工种的编号id!' }]"
      >
        <a-input-number id="inputNumber" style="width: 100%" v-model:value="edit_group.id" :min="1"
                        :max="100000" disabled="disabled"/>
      </a-form-item>
      <a-form-item
          label="商店编号"
          name="store_id"
          :rules="[{ required: true, message: '请输入商店的编号!' }]"
      >
        <a-input-number id="inputNumber" style="width: 100%" v-model:value="edit_group.store_id" :min="1"
                        :max="100000" disabled="disabled"/>
      </a-form-item>
      <a-form-item
          label="管理员编号"
          name="manager_id"
          :rules="[{ required: true, message: '请输入管理员的编号!' }]"
      >
        <a-input-number id="inputNumber" style="width: 100%" v-model:value="edit_group.manager_id" :min="1"
                        :max="100000"/>
      </a-form-item>
      <a-form-item
          label="组别名称"
          name="name"
          :rules="[{ required: true, message: '请输入组别的名称!' }]"
      >
        <a-input v-model:value="edit_group.name"/>
      </a-form-item>
      <a-form-item
          label="工种名称"
          name="type"
          :rules="[{ required: true, message: '请输入工种的名称!' }]"
      >
        <a-radio-group v-model:value="edit_group.type" button-style="solid">
          <a-radio-button value="CASHIER">收银</a-radio-button>
          <a-radio-button value="CUSTOMER_SERVICE">导购</a-radio-button>
          <a-radio-button value="STORAGE">库房</a-radio-button>
          <a-radio-button value="MANAGER">经理</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal title="增添信息" v-model:open="increase_open" @ok="increaseOk" okText="确认"
           cancelText="退出">
    <a-form
        :model="increase_group"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
    >
      <a-form-item
          label="管理员编号"
          name="manager_id"
          :rules="[{ required: true, message: '请输入管理员的编号!' }]"
      >
        <a-input-number id="inputNumber" style="width: 100%" v-model:value="increase_group.manager_id" :min="1"
                        :max="100000"/>
      </a-form-item>
      <a-form-item
          label="组别名称"
          name="name"
          :rules="[{ required: true, message: '请输入组别的名称!' }]"
      >
        <a-input v-model:value="increase_group.name"/>
      </a-form-item>
      <a-form-item
          label="工种名称"
          name="type"
          :rules="[{ required: true, message: '请输入工种的名称!' }]"
      >
        <a-radio-group v-model:value="increase_group.type" button-style="solid">
          <a-radio-button value="CASHIER">收银</a-radio-button>
          <a-radio-button value="CUSTOMER_SERVICE">导购</a-radio-button>
          <a-radio-button value="STORAGE">库房</a-radio-button>
          <a-radio-button value="MANAGER">经理</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>