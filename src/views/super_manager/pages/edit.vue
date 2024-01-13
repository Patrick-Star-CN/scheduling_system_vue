<script>
import {message} from "ant-design-vue";
import axios from "axios";
import router from "@/router";

export default {
  data(){
    return{
      Edit_password:{
        old_password:"",
        new_password:"",
        again_password:""
      }
    }
  },
  methods:{
    edit(){
      if(this.Edit_password.old_password==="" || this.Edit_password.new_password==="" || this.Edit_password.again_password===""){
        message.error('未能完整输入信息！');
        this.reset();
      }
      else if(this.Edit_password.new_password!==this.Edit_password.again_password){
        message.error('两次输入的密码不一致！');
        this.reset();
      }
      else{
        axios.post('/api/user/change_password', {
          old_password:this.Edit_password.old_password,
          new_password:this.Edit_password.new_password
        })
            .then(response => {
              this.data = response.data;
              if(this.data.msg==="success"){
                message.success('修改密码成功！');
              }
              else if(this.data.data.code===10001){
                router.push("/")
                message.warn("登录过期")
              }
              else{
                message.warning('修改密码失败！');
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
      }
    },
    reset(){
      this.Edit_password.old_password="";
      this.Edit_password.new_password="";
      this.Edit_password.again_password="";
    }
  }
}
</script>

<template>
  <a-flex justify="center">
    <span style="font-weight: bold;font-size: 20px;letter-spacing: 5px">修改密码</span>
  </a-flex>
  <br>
  <a-form :label-col="{ span: 8 }"
          :wrapper-col="{ span: 9 }"
          autocomplete="off"
          :model="Edit_password">
    <a-form-item
        label="原始密码"
        name="old_password"
    >
      <a-input v-model:value="Edit_password.old_password"/>
    </a-form-item>

    <a-form-item
        label="需要修改的密码"
        name="new_password"
    >
      <a-input-password v-model:value="Edit_password.new_password"/>
    </a-form-item>
    <a-form-item
        label="再次输入密码"
        name="again_password"
    >
      <a-input-password v-model:value="Edit_password.again_password"/>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-row>
        <a-col :span="4" :offset="1">
          <a-button type="primary" html-type="submit" class="button" @click="edit">修改</a-button>
        </a-col>
        <a-col :span="4" :offset="1" >
          <a-button class="button" style="background-color: #EBEDF0" @click="reset">重置</a-button>
        </a-col>
      </a-row>

    </a-form-item>
  </a-form>
</template>

<style scoped>
.button{
  width: 100%;
}
</style>