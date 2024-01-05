<script>

import axios from "axios";
import {message} from "ant-design-vue";

export default {
  props: {
    user_detail: Object,
  },
  data() {
    return {
      open: false,
      days: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      numbers: Array.from({length: 42}, (v, k) => k + 1),
      staff_shift: [
        {
          start_time: "07:00",
          end_time: "09:00"
        },
        {
          start_time: "09:00",
          end_time: "12:00"
        },
        {
          start_time: "12:00",
          end_time: "15:00"
        },
        {
          start_time: "15:00",
          end_time: "18:00"
        },
        {
          start_time: "18:00",
          end_time: "21:00"
        },
        {
          start_time: "21:00",
          end_time: "22:00"
        },
      ],
      shift_detail:Array.from({ length: 6 }, () => new Array(7).fill(false)),
      Detail:Array.from({ length: 6 }, () => new Array(7)),
      schedule: ""
    }
  },
  methods: {
    detail(i,j) {
      this.open = true;
      console.log(this.Detail[i][j])
      this.schedule=this.Detail[i][j]
    },
    get_shift() {
      axios.get('/api/shift/' + this.user_detail.store_id, {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              this.data = this.data.data
              const start_time = this.data.start_time
              const end_time = this.data.end_time
              this.staff_shift[0].start_time = start_time
              this.staff_shift[this.staff_shift.length - 1].end_time = end_time
            } else {
              message.error('获取信息失败！');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
    get_shift_detail(){
      axios.get('/api/shift/schedule/' + this.user_detail.store_id, {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              const detail=this.data.data
              console.log(detail)
              for(let i=0; i< detail.length;++i){
                const details=detail[i].scheduleDetails;
                for(let j=0;j<details.length;++j){
                  const EveDeatil=details[j];
                  this.Detail[j][i]=EveDeatil
                  const cashierList=EveDeatil.cashierList;
                  const customerServiceList=EveDeatil.customerServiceList;
                  const storageList=EveDeatil.storageList;
                  for(let inf of cashierList){
                    if(inf.name===this.user_detail.name){
                      this.shift_detail[j][i]=true
                    }
                  }
                  for(let inf of customerServiceList){
                    if(inf.name===this.user_detail.name){
                      this.shift_detail[j][i]=true
                    }
                  }
                  for(let inf of storageList){
                    if(inf.name===this.user_detail.name){
                      this.shift_detail[j][i]=true
                    }
                  }
                }
              }
              console.log(this.Detail)
            } else {
              message.error('获取信息失败！');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
  },
  created() {
    this.get_shift()
    this.get_shift_detail()
  }
}
</script>

<template>
  <a-flex wrap="wrap" gap="middle" justify="center">
    <div v-for="item in days" :key="item" class="column">
      {{ item }}
    </div>
    <a-flex wrap="wrap" gap="middle" justify="center" v-for="item in numbers" :key="item" class="Shedule">
      <a-button class="Shedule_button" type="primary" @click="detail(Math.floor((item - 1) / 7),Math.floor((item - 1) % 7))" v-if="shift_detail[Math.floor((item - 1) / 7)][Math.floor((item - 1) % 7)]">
        <span>{{ staff_shift[Math.floor((item - 1) / 7)].start_time }}~{{ staff_shift[Math.floor((item - 1) / 7)].end_time }}</span>
      </a-button>
      <a-button class="Shedule_button" style="background-color: #c6e2ff"  @click="detail(Math.floor((item - 1) / 7),Math.floor((item - 1) % 7))" v-else>
        <span>{{ staff_shift[Math.floor((item - 1) / 7)].start_time }}~{{ staff_shift[Math.floor((item - 1) / 7)].end_time }}</span>
      </a-button>
      <!--      <a-button  class="Shedule_button" v-if="item<=7" type="primary">-->
      <!--        <span>{{staff_shift[Math.floor((item-1)/7)].start_time}}</span>-->
      <!--      </a-button>-->
      <!--      <a-button  class="Shedule_button" v-else style="background-color: #EBEDF0">-->
      <!--        <span>{{item}}</span>-->
      <!--      </a-button>-->
    </a-flex>
  </a-flex>
  <a-drawer
      v-model:open="open"
      class="shift_detail"
      root-class-name="root-class-name"
      style="font-size: 20px"
      :root-style="{ color: 'black' }"
      title="排班信息"
      placement="right"
  >
    <div v-if="schedule.cashierList.length!==0">
      <p style="font-weight: bold">收银</p>
      <ul>
        <li v-for="user in schedule.cashierList" :key="user">
          <span>{{user.name}}</span>
        </li>
      </ul>
    </div>

    <div v-if="schedule.customerServiceList.length!==0">
      <p style="font-weight: bold">导购</p>
      <ul>
        <li v-for="user in schedule.customerServiceList" :key="user">
          <span>{{user.name}}</span>
        </li>
      </ul>
    </div>

    <div v-if="schedule.storageList.length!==0">
      <p style="font-weight: bold">库房</p>
      <ul>
        <li v-for="user in schedule.storageList" :key="user">
          <span>{{user.name}}</span>
        </li>
      </ul>
    </div>

  </a-drawer>
</template>

<style scoped>
.shift_detail {
  text-align: center;
}

.column {
  width: 13%;
  height: 5vh;
  line-height: 5vh;
  text-align: center;
  border-radius: 5px;
  background-color: #CDD0D6;
  letter-spacing: 5px;
}

.Shedule {
  width: 13%;
  height: 9vh;
}

.Shedule_button {
  width: 100%;
  height: 100%;
}
</style>