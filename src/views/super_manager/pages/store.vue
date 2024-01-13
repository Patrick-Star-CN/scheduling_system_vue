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
    axios.get('/api/store', {})
        .then(response => {
          Store.detail = response.data.data;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    console.log(Store)
    return {store, user, Store}
  },

  data() {
    return {
      columns: [
        {
          title: '商店编号',
          dataIndex: 'store_id',
          key: 'store_id',
        },
        {
          title: '商店名字',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '商店地址',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '商店大小',
          dataIndex: 'size',
          key: 'size',
        },
        {
          title: '操作',
          key: 'action',
        },
      ],
      increase_store: {
        store_id: "",
        name: "",
        address: "",
        size: ""
      },
      edit_store: {
        store_id: "",
        name: "",
        address: "",
        size: ""
      },
      increase_open: false,
      edit_open: false,
    }
  },
  methods: {
    Delete(column, record) {
      console.log(column, record)
      axios.delete('/api/store/' + record.store_id, {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              message.success('删除成功！');
              this.reload()
            }
            else if(this.data.data.code===10001){
              router.push("/")
              message.warn("登录过期")
            }
            else {
              message.error('删除失败！');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });

    },
    edit(column, record) {
      this.edit_store=record
      this.edit_open = true
    },
    editOk() {
      this.edit_open = false;
      this.edit_store.size=parseFloat(this.edit_store.size)
      axios.put('/api/store', {
        store_id: this.edit_store.store_id,
        name: this.edit_store.name,
        address: this.edit_store.address,
        size:this.edit_store.size
      })
          .then(response => {
            console.log(response.data)
            this.data = response.data;
            if (this.data.msg === "success") {
              message.success('修改成功！');
              this.reload()
            }
            else if(this.data.data.code===10001){
              router.push("/")
              message.warn("登录过期")
            }
            else {
              message.error('修改失败！');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      this.edit_open = !this.edit_open
    },
    increaseOk() {
      console.log(this.increase_store)
      if (this.increase_store.store_id === "" || this.increase_store.name === "" ||
          this.increase_store.address === "" || this.increase_store.size === "") {
        message.error("无法添加，未完整输入信息")
      } else {
        this.increase_open = false;
        this.increase_store.size=parseFloat(this.increase_store.size)
        console.log(this.increase_store)
        axios.post('/api/store', {
          store_id: this.increase_store.store_id,
          name: this.increase_store.name,
          address: this.increase_store.address,
          size:this.increase_store.size
        })
            .then(response => {
              this.data = response.data;
              if (this.data.msg === "success") {
                message.success('添加成功！');
                this.reload()
              }
              else if(this.data.data.code===10001){
                router.push("/")
                message.warn("Token已被顶下线")
              }
              else {
                message.error('添加失败！');
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
      }
    }
  }
}
</script>
<template>
  <div style="display: flex;justify-content: flex-end">
    <a-button size="large" style="margin-bottom: 10px;"
              type="primary"
              @click="increase_open = true">
      <PlusOutlined/>
      增加信息
    </a-button>
  </div>
  <a-table :columns="columns" :data-source="Store.detail" :pagination="{ pageSize: 6 }">
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
           cancelText="退出">
    <a-form
        :model="edit_store"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
    >
      <a-form-item
          label="商店编号"
          name="store_id"
          :rules="[{ required: true, message: '请输入商店的编号id!' }]"
      >
        <a-input-number id="inputNumber" style="width: 100%" v-model:value="edit_store.store_id" :min="1"
                        :max="100000" disabled="disabled"/>
      </a-form-item>
      <a-form-item
          label="商店名字"
          name="name"
          :rules="[{ required: true, message: '请输入商店的名字!' }]"
      >
        <a-input v-model:value="edit_store.name"/>
      </a-form-item>
      <a-form-item
          label="商店地址"
          name="address"
          :rules="[{ required: true, message: '请输入商店的地址!' }]"
      >
        <a-input v-model:value="edit_store.address"/>
      </a-form-item>
      <a-form-item
          label="商店面积"
          name="size"
          :rules="[{ required: true, message: '请输入商店的面积!' }]"
      >
        <a-input-number
            v-model:value="edit_store.size"
            style="width: 100%"
            :min="0"
            :max="10000"
            :step="0.001"
            string-mode
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal title="增添信息" v-model:open="increase_open" @ok="increaseOk" okText="确认"
           cancelText="退出">
    <a-form
        :model="increase_store"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
    >
      <a-form-item
          label="商店编号"
          name="store_id"
          :rules="[{ required: true, message: '请输入商店的编号id!' }]"
      >
        <a-input-number id="inputNumber" style="width: 100%" v-model:value="increase_store.store_id" :min="1"
                        :max="100000"/>
      </a-form-item>
      <a-form-item
          label="商店名字"
          name="name"
          :rules="[{ required: true, message: '请输入商店的名字!' }]"
      >
        <a-input v-model:value="increase_store.name"/>
      </a-form-item>
      <a-form-item
          label="商店地址"
          name="address"
          :rules="[{ required: true, message: '请输入商店的地址!' }]"
      >
        <a-input v-model:value="increase_store.address"/>
      </a-form-item>
      <a-form-item
          label="商店面积"
          name="size"
          :rules="[{ required: true, message: '请输入商店的面积!' }]"
      >
        <a-input-number
            v-model:value="increase_store.size"
            style="width: 100%"
            :min="0"
            :max="10000"
            :step="0.001"
            string-mode
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>