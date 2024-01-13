<script>
import {message} from "ant-design-vue";
import axios from "axios";

export default {
  data(){
    return{
      Shift_schedule:{
        days:"",
        time:"",
        shift_days:"",
        shift_time:"",
        shift_person:"",
        shift_bool:"",
        shiftPersons: [ // 假的用户列表
          { record_id: '1', name: '张三' },
          { record_id: '2', name: '李四' },
          { record_id: '3', name: '王五' }
        ]// 新添加的属性
      }
    }
  },
  methods:{
    shift(){
      if(this.Shift_schedule.days==="" || this.Shift_schedule.time===""){
        message.error('未能完整输入信息！');
        this.reset();
      }
      else{
        axios.get('/api/', {
          days:this.Shift_schedule.days,
          time:this.Shift_schedule.time
        })
            .then(response => {
              this.data = response.data;
              if(this.data.msg==="success"){
                message.success('提交换班申请成功！');
              }
              else{
                message.warning('提交换班申请失败！');
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
      }
    },
    getShiftPersons() {
      axios.get('/api/user/shift')
          .then(response => {
            this.Shift_schedule.shiftPersons = response.data.map(item => item.name);
          })
          .catch(error => {
            console.error('Error fetching shift persons:', error);
          });

    },
    shiftBoolTrue(){
      var group1 = document.getElementById('group1');
      var group2 = document.getElementById('group2');
      group1.style.display = "none";
      group2.style.display = "none";
      this.Shift_schedule.shift_days="";
      this.Shift_schedule.shift_time="";
    },
    shiftBoolFalse(){
      var group1 = document.getElementById('group1');
      var group2 = document.getElementById('group2');
      group1.style.display = "flex";
      group2.style.display = "flex";
    },
    reset(){
      this.Shift_schedule.days="";
      this.Shift_schedule.time="";
      this.Shift_schedule.shift_days="";
      this.Shift_schedule.shift_time="";
      this.Shift_schedule.shift_person="";
      this.Shift_schedule.shift_bool="";
      var group1 = document.getElementById('group1');
      var group2 = document.getElementById('group2');
      group1.style.display = "flex";
      group2.style.display = "flex";
    },
    created() {
      this.shiftBoolFalse();
    }
  }
}
</script>

<template>
  <a-form :label-col="{ span: 8 }"
          :wrapper-col="{ span: 9 }"
          autocomplete="off"
          :model="Shift_schedule">
    <a-form-item
        label="星期"
        name="days"
    >
      <a-radio-group v-model:value="Shift_schedule.days" button-style="solid">
        <a-radio-button value="Mon">星期一</a-radio-button>
        <a-radio-button value="Tue">星期二</a-radio-button>
        <a-radio-button value="Wed">星期三</a-radio-button>
        <a-radio-button value="Thu">星期四</a-radio-button>
        <a-radio-button value="Fri">星期五</a-radio-button>
        <a-radio-button value="Sat">星期六</a-radio-button>
        <a-radio-button value="Sun">星期日</a-radio-button>
      </a-radio-group>
    </a-form-item>

    <a-form-item
        label="班次"
        name="time"
    >
      <a-radio-group v-model:value="Shift_schedule.time" button-style="solid">
        <a-radio-button value="1">07:00~09:00</a-radio-button>
        <a-radio-button value="2">09:00~12:00</a-radio-button>
        <a-radio-button value="3">12:00~15:00</a-radio-button>
        <a-radio-button value="4">15:00~18:00</a-radio-button>
        <a-radio-button value="5">18:00~21:00</a-radio-button>
        <a-radio-button value="6">21:00~22:00</a-radio-button>
      </a-radio-group>
    </a-form-item>

    <div style="font-size: 40px;display: flex;justify-content: center; margin-bottom: 20px;">
      <ColumnHeightOutlined /><span style="font-size: 25px;display: flex;justify-content: center;">更换排班</span>
    </div>

    <a-form-item id="group1"
                 label="换班星期"
                 name="shift_days"
    >
      <a-radio-group v-model:value="Shift_schedule.shift_days" button-style="solid">
        <a-radio-button value="Mon">星期一</a-radio-button>
        <a-radio-button value="Tue">星期二</a-radio-button>
        <a-radio-button value="Wed">星期三</a-radio-button>
        <a-radio-button value="Thu">星期四</a-radio-button>
        <a-radio-button value="Fri">星期五</a-radio-button>
        <a-radio-button value="Sat">星期六</a-radio-button>
        <a-radio-button value="Sun">星期日</a-radio-button>
      </a-radio-group>
    </a-form-item>

    <a-form-item id="group2"
                 label="换班班次"
                 name="shift_time"
    >
      <a-radio-group v-model:value="Shift_schedule.shift_time" button-style="solid">
        <a-radio-button value="1">07:00~09:00</a-radio-button>
        <a-radio-button value="2">09:00~12:00</a-radio-button>
        <a-radio-button value="3">12:00~15:00</a-radio-button>
        <a-radio-button value="4">15:00~18:00</a-radio-button>
        <a-radio-button value="5">18:00~21:00</a-radio-button>
        <a-radio-button value="6">21:00~22:00</a-radio-button>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="换班对象" name="shift_person">
      <a-select v-model:value="Shift_schedule.shift_person">
        <a-select-option v-for="personName in Shift_schedule.shiftPersons" :key="personName" :value="personName">
          {{ personName.name}}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
        label="是否为替换"
        name="shift_bool"
    >
      <a-radio-group v-model:value="Shift_schedule.shift_bool" button-style="solid">
        <a-radio-button value="true" @click="shiftBoolTrue">是</a-radio-button>
        <a-radio-button value="false" @click="shiftBoolFalse">否</a-radio-button>
      </a-radio-group>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-row>
        <a-col :span="4" :offset="1">
          <a-button type="primary" html-type="submit" class="button" @click="shift">申请换班</a-button>
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