<script setup>
import { reactive,onMounted } from 'vue';
import { message } from 'ant-design-vue';
import axios from 'axios';

const Shift_schedule = reactive({
  days: "",
  time: "",
  shift_days: "",
  shift_time: "",
  shift_person: "",
  shift_bool: "",
  shiftPersons: []
});

const getShiftPersons = async () => {
  try {
    const response = await axios.get('/api/user/shift');
    if (response.data.code === 200 && response.data.data) {
      Shift_schedule.shiftPersons = response.data.data.map(item => {
        // 输出每个项目的 id 和 name
        console.log('id:', item.user_id, 'name:', item.name);

        return {
          id: item.user_id,
          name: item.name
        };
      });
    } else {
      console.error('Invalid response:', response);
    }
  } catch (error) {
    console.error('Error fetching shift persons:', error);
    console.error('Error details:', error.response ? error.response.data : 'No response data');
  }
};


const shift = () => {
  // 验证所有必要的字段是否已选择
  if(Shift_schedule.days === "" || Shift_schedule.time === "" || Shift_schedule.shift_person === "") {
    message.error('未能完整输入信息！');
    this.reset();
    return; // 退出函数
  }

  // 构建要发送的数据对象
  let requestData = {
    week_id_change: parseInt(Shift_schedule.days),
    shift_id_change: parseInt(Shift_schedule.time),
    user_id_changed: parseInt(Shift_schedule.shift_person),
    week_id_changed: Shift_schedule.shift_bool === 'false' ? parseInt(Shift_schedule.shift_days) : null,
    shift_id_changed: Shift_schedule.shift_bool === 'false' ? parseInt(Shift_schedule.shift_time) : null,
  };

  // 打印 requestData 来检查值
  console.log(requestData);

  // 发送请求到后端
  axios.post('/api/shift/change-shift-worker', requestData)
      .then(response => {
        if(response.data.msg === "success"){
          message.success('提交换班申请成功！');
        } else {
          message.warning('提交换班申请失败！');
        }
      })
      .catch(error => {
        console.error('Error submitting shift request:', error);
      });
};

const shiftBoolTrue = () => {
  var group1 = document.getElementById('group1');
  var group2 = document.getElementById('group2');
  group1.style.display = "none";
  group2.style.display = "none";
  Shift_schedule.shift_days="";
  Shift_schedule.shift_time="";
};

const shiftBoolFalse = () => {
  var group1 = document.getElementById('group1');
  var group2 = document.getElementById('group2');
  group1.style.display = "flex";
  group2.style.display = "flex";
  console.error('OKOK2');
};

const reset = () => {
  Shift_schedule.days="";
  Shift_schedule.time="";
  Shift_schedule.shift_days="";
  Shift_schedule.shift_time="";
  Shift_schedule.shift_person="";
  Shift_schedule.shift_bool="";
  var group1 = document.getElementById('group1');
  var group2 = document.getElementById('group2');
  group1.style.display = "flex";
  group2.style.display = "flex";
};

onMounted(() => {
  getShiftPersons();
  shiftBoolFalse();
});


</script>

<template>
  <a-form :label-col="{ span: 8 }"
          :wrapper-col="{ span: 9 }"
          autocomplete="off"
          :model="Shift_schedule">
    <a-form-item
        label="选择你要被换班的时间"
        name="days"
    >
      <a-radio-group v-model:value="Shift_schedule.days" button-style="solid">
        <a-radio-button value="0">星期一</a-radio-button>
        <a-radio-button value="1">星期二</a-radio-button>
        <a-radio-button value="2">星期三</a-radio-button>
        <a-radio-button value="3">星期四</a-radio-button>
        <a-radio-button value="4">星期五</a-radio-button>
        <a-radio-button value="5">星期六</a-radio-button>
        <a-radio-button value="6">星期日</a-radio-button>
      </a-radio-group>
    </a-form-item>

    <a-form-item
        label="选择你要被换班的班次"
        name="time"
    >
      <a-radio-group v-model:value="Shift_schedule.time" button-style="solid">
        <a-radio-button value="0">开店前</a-radio-button>
        <a-radio-button value="1">09:00~12:00</a-radio-button>
        <a-radio-button value="2">12:00~15:00</a-radio-button>
        <a-radio-button value="3">15:00~18:00</a-radio-button>
        <a-radio-button value="4">18:00~21:00</a-radio-button>
        <a-radio-button value="5">关店后</a-radio-button>
      </a-radio-group>
    </a-form-item>

    <div style="font-size: 40px;display: flex;justify-content: center; margin-bottom: 20px;">
      <ColumnHeightOutlined /><span style="font-size: 25px;display: flex;justify-content: center;">更换排班</span>
    </div>

    <a-form-item id="group1"
                 label="选择你想要到的换班时间"
                 name="shift_days"
    >
      <a-radio-group v-model:value="Shift_schedule.shift_days" button-style="solid">
        <a-radio-button value="0">星期一</a-radio-button>
        <a-radio-button value="1">星期二</a-radio-button>
        <a-radio-button value="2">星期三</a-radio-button>
        <a-radio-button value="3">星期四</a-radio-button>
        <a-radio-button value="4">星期五</a-radio-button>
        <a-radio-button value="5">星期六</a-radio-button>
        <a-radio-button value="6">星期日</a-radio-button>
      </a-radio-group>
    </a-form-item>

    <a-form-item id="group2"
                 label="选择你想要的换班班次"
                 name="shift_time"
    >
      <a-radio-group v-model:value="Shift_schedule.shift_time" button-style="solid">
        <a-radio-button value="0">开店前</a-radio-button>
        <a-radio-button value="1">09:00~12:00</a-radio-button>
        <a-radio-button value="2">12:00~15:00</a-radio-button>
        <a-radio-button value="3">15:00~18:00</a-radio-button>
        <a-radio-button value="4">18:00~21:00</a-radio-button>
        <a-radio-button value="5">关店后</a-radio-button>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="选择您的换班对象" name="shift_person">
      <a-select v-model:value="Shift_schedule.shift_person">
        <a-select-option
            v-for="person in Shift_schedule.shiftPersons"
            :key="person.id"
            :value="person.id">
          {{ person.name }}
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