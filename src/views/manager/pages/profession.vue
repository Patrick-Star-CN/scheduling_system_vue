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
          title: '工种编号',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '商店编号',
          dataIndex: 'storeId',
          key: 'storeId',
        },
        {
          title: '管理员编号',
          dataIndex: 'managerId',
          key: 'managerId',
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
      increase_profession: {
        managerId: "",
        type: ""
      },
      edit_profession: {
        id: "",
        storeId: "",
        managerId: "",
        type: ""
      },
      increase_open: false,
      edit_open: false,
      detail:''
    }
  },
  methods: {
    Delete(column, record) {
      console.log(column, record)
      axios.delete('/api/profession/' + record.id, {})
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
      this.edit_profession=record
      this.edit_open = true
    },
    editCancel(){
      this.reload()
    },
    editOk() {
      this.edit_open = false;
      axios.put('/api/profession', {
        id: this.edit_profession.id,
        storeId: this.edit_profession.storeId,
        managerId: this.edit_profession.managerId,
        type:this.edit_profession.type
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
      console.log(this.increase_profession)
      if (this.increase_profession.managerId === "" || this.increase_profession.type === "") {
        message.error("无法添加，未完整输入信息")
      } else {
        this.increase_open = false;
        console.log(this.increase_profession)
        axios.post('/api/profession/' + this.increase_profession.managerId + '/' + this.increase_profession.type, {
          managerId: this.increase_profession.managerId,
          type:this.increase_profession.type
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
    get_profession(){
      axios.get('/api/profession', {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              this.detail = this.data.data;
              console.log(this.detail);
            }
            else if(this.data.data.code===10001){
              router.push("/")
              message.warn("Token已被顶下线")
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    }
  },
  created() {
    this.get_profession();
  }
}
</script>
<template>
  <div style="display: flex;justify-content: flex-end">
    <a-button size="large" style="margin-bottom: 10px;" type="primary"
              @click="increase_open = true">
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
        :model="edit_profession"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
    >
      <a-form-item
          label="工种编号"
          name="id"
          :rules="[{ required: true, message: '请输入工种的编号id!' }]"
      >
        <a-input-number id="inputNumber" style="width: 100%" v-model:value="edit_profession.id" :min="1"
                        :max="100000" disabled="disabled"/>
      </a-form-item>
      <a-form-item
          label="商店编号"
          name="storeId"
          :rules="[{ required: true, message: '请输入商店的编号!' }]"
      >
        <a-input-number id="inputNumber" style="width: 100%" v-model:value="edit_profession.storeId" :min="1"
                        :max="100000" disabled="disabled"/>
      </a-form-item>
      <a-form-item
          label="管理员编号"
          name="managerId"
          :rules="[{ required: true, message: '请输入管理员的编号!' }]"
      >
        <a-input-number id="inputNumber" style="width: 100%" v-model:value="edit_profession.managerId" :min="1"
                        :max="100000"/>
      </a-form-item>
      <a-form-item
          label="工种名称"
          name="type"
          :rules="[{ required: true, message: '请输入工种的名称!' }]"
      >
        <a-radio-group v-model:value="edit_profession.type" button-style="solid">
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
        :model="increase_profession"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
    >
      <a-form-item
          label="管理员编号"
          name="managerId"
          :rules="[{ required: true, message: '请输入管理员的编号!' }]"
      >
        <a-input-number id="inputNumber" style="width: 100%" v-model:value="increase_profession.managerId" :min="1"
                        :max="100000"/>
      </a-form-item>
      <a-form-item
          label="工种名称"
          name="type"
          :rules="[{ required: true, message: '请输入工种的名称!' }]"
      >
        <a-radio-group v-model:value="increase_profession.type" button-style="solid">
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