<script>
  import {message} from "ant-design-vue";
  import axios from "axios";

  export default {
    data(){
      return{
        fileList:[],
        columns: [
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
          },
          {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
          },
          {
            title: '开始时间',
            dataIndex: 'start_time',
            key: 'start_time',
          },
          {
            title: '结束时间',
            dataIndex: 'end_time',
            key: 'end_time',
          },
          {
            title: '客流',
            dataIndex: 'flow',
            key: 'flow',
          },
          {
            title: '商店编号',
            dataIndex: 'store_id',
            key: 'store_id',
          },
          {
            title: '操作',
            key: 'action',
          },
        ],
        flow:[]
      }
    },
    methods:{
      async uploadFiles(info) {
        //初始化文件信息
        this.fileInfo = {
          uid: info.file.uid,
          name: info.file.name,
          status: "uploading",
          response: "",
          url: "",
        };
        //调用公共上传方法
        await this.uploadFilesToServer(
            info.file
        );
      },

      uploadFilesToServer(files) {
        axios.post('/api/shift/customer-flow', {
          file:files,
        })
            .then(response => {
              this.data = response.data;
              if (this.data.msg === "success") {
                this.fileInfo.status = "done";
                this.fileList.pop()
                this.fileList.push(this.fileInfo)
                message.success(files.name+"上传成功！");
              } else {
                this.fileInfo.status = "error";
                this.fileList.pop()
                this.fileList.push(this.fileInfo)
                console.log(this.fileList)
                message.error(files.name+"上传失败！");
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
      },
      get_flow(){
        axios.get('/api/shift/customer-flow', {})
            .then(response => {
              this.data = response.data;
              if(this.data.msg==="success"){
                this.flow=this.data.data
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
      }
    },
    created() {
      this.get_flow()
    }
  }
</script>

<template>
  <a-flex justify="center">
    <h2 style="font-weight: bold;font-size: 25px;letter-spacing: 8px">
      添加客流信息
    </h2>

  </a-flex>
  <div style="height: 20vh">
    <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :multiple="false"
        :customRequest="uploadFiles"
    >
      <p class="ant-upload-drag-icon" style="margin-top:0">
        <inbox-outlined></inbox-outlined>
      </p>
      <p class="ant-upload-text">点击或者拖曳上传多个文件</p>
      <p class="ant-upload-hint">
        导入对应的客流信息，支持上传多文件和单文件
      </p>
    </a-upload-dragger>
  </div>
  <br>
  <a-divider></a-divider>
  <a-table :columns="columns" :data-source="flow" :pagination="{ pageSize: 3 }">
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

</template>

<style scoped>

</style>