<script>
import axios from "axios";
import {message} from "ant-design-vue";

export default {
  inject:["reload"],
  data() {
    return {
      add_user: {
        name: "",
        role: "",
        store: "",
        group: ""
      },
      store: "",
      fileList:"",
      name:[],
      group_name:{},
      group:"",
      store_name:"",
      data:""
    }
  },
  methods: {
    async getStore() {  //async  await  是解决异步的一种方案，必须要加，但是原生封装就不用
      const {data: res} = await axios.get('/api/store')
      this.store = res.data
      this.store_name=this.store[0].name
    },
    get_group(){
      if(this.add_user.role !== ""){
        console.log(this.store[0].store_id)
        axios.get('api/group/list', {
          params:{
            store_id: this.store[0].store_id,
            type:this.add_user.role
          }
        })
            .then(response => {
              this.group=response.data
              for(let i=0;i<this.group.data.length;++i){
                this.name[i]=(this.group.data[i].name)
                this.group_name[this.name[i]]=this.group.data[i].id
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
      }
    },
    handleImportExcel(info){
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件成功提交`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件提交失败`);
      }
    },
    Add(){
      // console.log([this.add_user.name,this.store[0].store_id,this.group_name[this.add_user.group],this.add_user.role])
      axios.post('/api/user', {
        name: this.add_user.name,
        store_id:this.store[0].store_id ,
        group_id: this.group_name[this.add_user.group],
        type: this.add_user.role,
      })
          .then(response => {
            console.log(response.data)
            this.data=response.data
            if (this.data.msg === "success") {
              message.success('添加成功！');
              this.reload()
            } else {
              message.error('添加失败！');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    }
  },
  created() {
    this.getStore()
  }
}
</script>

<template>
  <a-flex justify="center">
    <h2 style="font-weight: bold;font-size: 25px">
      增加单个用户
    </h2>
  </a-flex>
  <a-form
      :model="add_user"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      autocomplete="off"
  >
    <a-form-item
        label="姓名"
        name="name"
        :rules="[{ required: true, message: '输入你的姓名!' }]"
    >
      <a-input v-model:value="add_user.name" @change="get_group"/>
    </a-form-item>
    <a-form-item
        label="所属门店"
        name="store"
    >
    <a-input v-model:value="store_name" disabled="disabled"></a-input>
    </a-form-item>
    <a-form-item
        label="角色"
        name="role"
        :rules="[{ required: true, message: '请输入所属门店!' }]"
    >
      <a-radio-group v-model:value="add_user.role" button-style="solid" @change="get_group">
        <a-radio-button value="CASHIER">收银</a-radio-button>
        <a-radio-button value="CUSTOMER_SERVICE">导购</a-radio-button>
        <a-radio-button value="STORAGE">库房</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item
        label="所属组别"
        name="group"
        :rules="[{ required: true, message: '请输入所属门店!' }]"
    >
      <a-select v-model:value="add_user.group">
        <a-select-option v-for="group in name" :key="group" :value="group">{{group}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 10, span: 4 }">
      <a-button type="primary" html-type="submit" style="width: 100%" @click="Add">提交</a-button>
    </a-form-item>
  </a-form>
  <a-divider style="border-color: #252323" dashed />
  <a-flex justify="center">
    <h2>导入文件</h2>

  </a-flex>
  <a-flex justify="center">
    <a-upload-dragger
        name="file"
        @change="handleImportExcel"
        style="width: 100%"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined></inbox-outlined>
      </p>
      <p class="ant-upload-text">Click or drag file to this area to upload</p>
      <p class="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
    </a-upload-dragger>
  </a-flex>
</template>

<style scoped>

</style>