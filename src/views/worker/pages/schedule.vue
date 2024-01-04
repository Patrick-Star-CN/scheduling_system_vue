<script>

  export default {
    data(){
      return{
        open:false,
        days:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],
        numbers: Array.from({ length: 42 }, (v, k) => k + 1),
        staff_shift:[
          {
            start_time: "8:00",
            end_time: "9:00",
            shift_id: 1,
          },
          {
            start_time: "9:00",
            end_time: "12:00",
            shift_id: 2,
          },
          {
            start_time: "12:00",
            end_time: "15:00",
            shift_id: 3,
          },
          {
            start_time: "15:00",
            end_time: "18:00",
            shift_id: 4,
          },
          {
            start_time: "18:00",
            end_time: "21:00",
            shift_id: 5,
          },
          {
            start_time: "21:00",
            end_time: "23:00",
            shift_id: 6,
          },
        ]
      }
    },
    methods:{
      detail(){
        this.open=true;
      }
    }
  }
</script>

<template>
  <a-flex wrap="wrap" gap="middle" justify="center">
    <div v-for="item in days" :key="item" class="column">
        {{item}}
    </div>
    <a-flex wrap="wrap" gap="middle" justify="center" v-for="item in numbers" :key="item" class="Shedule">
      <a-button  class="Shedule_button" type="primary" @click="detail">
        <span>{{staff_shift[Math.floor((item-1)/7)].start_time}}~{{staff_shift[Math.floor((item-1)/7)].end_time}}</span>
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
      :root-style="{ color: 'blue' }"
      style="color: red"
      title="排班信息"
      placement="right"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>

<style scoped>
.shift_detail{
  text-align: center;
}
.column{
  width: 13%;
  height: 5vh;
  line-height: 5vh;
  text-align: center;
  border-radius: 5px;
  background-color: #CDD0D6;
  letter-spacing: 5px;
}
  .Shedule{
    width: 13%;
    height: 9vh;
  }
  .Shedule_button{
    width: 100%;
    height: 100%;
  }
</style>