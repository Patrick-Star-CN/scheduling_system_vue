<script>
  import {message} from "ant-design-vue";
  import axios from "axios";

  export default {
    data(){
      return{
        fileList:[]
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
    }
  }
</script>

<template>
  <a-flex justify="center">
    <h2 style="font-weight: bold;font-size: 25px;letter-spacing: 8px">
      添加客流信息
    </h2>

  </a-flex>
  <div style="height: 50vh">
    <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :multiple="false"
        :customRequest="uploadFiles"
    >
      <p class="ant-upload-drag-icon" style="margin-top: 10vh">
        <inbox-outlined></inbox-outlined>
      </p>
      <p class="ant-upload-text">点击或者拖曳上传多个文件</p>
      <p class="ant-upload-hint">
        导入对应的客流信息，支持上传多文件和单文件
      </p>
    </a-upload-dragger>
  </div>

</template>

<style scoped>

</style>