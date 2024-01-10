<script>
// 先引入echarts
// import * as echarts from "echarts";
// // vue3 引入对应功能
// import { onMounted, ref } from "vue";

export default {
  props:{
    user_detail:Object,
    role:Object
  },
  // setup() {
  //   // 声明chart1，使用ref赋值null
  //   const chart1 = ref(null);
  //
  //   // 声明echarts函数
  //   const chart = () => {
  //     // 解决echarts在vue中切换到其他页面再返回来就不显示的问题
  //     chart1.value.setAttribute("_echarts_instance_", "");
  //     // 这里使用chart1.value的形式获取到dom节点
  //     let myChart = echarts.init(chart1.value);
  //
  //     // 绘制图表
  //     myChart.setOption({
  //       grid: {
  //         top: "30",
  //         right: "30",
  //         bottom: "30",
  //         left: "30",
  //       },
  //       xAxis: {
  //         type: "category",
  //         data: ["1", "2", "3", "4", "5", "6", "7"],
  //       },
  //       yAxis: {
  //         type: "value",
  //       },
  //       series: [
  //         {
  //           data: [820, 932, 901, 934, 1290, 1330, 1320],
  //           type: "line",
  //           smooth: true,
  //         },
  //       ],
  //     });
  //     // echarts 自适应，如果dom元素是自适应高宽，会随之改变echarts大小
  //     window.addEventListener("resize", () => {
  //       myChart.resize();
  //     });
  //   };
  //   // 数据渲染完成后在这里挂载
  //   onMounted(() => {
  //     chart();
  //   });
  //
  //   return {
  //     chart1,
  //   };
  // },
};
</script>

<template>
  <a-row :gutter="[72,24]">
    <a-col :span="8">
      <a-card class="card" hoverable>
        <a-card-grid style="width: 40%;text-align: center;background-color: #1482f0">
          <UserOutlined style="color: white;font-size: 50px"/>
        </a-card-grid>
        <a-card-grid style="width: 60%;text-align: right;background-color: #F2F6FC">
          姓名：
          <div style="font-weight: bold;color: #303133">
            {{user_detail.name}}
          </div>
        </a-card-grid>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card class="card" hoverable>
        <a-card-grid style="width: 40%;text-align: center;background-color: #E6A23C">
          <StarOutlined style="color: white;font-size: 50px"/>
        </a-card-grid>
        <a-card-grid style="width: 60%;text-align: right;background-color: #F2F6FC">
          身份：
          <div style="font-weight: bold;color: #303133">
            {{role[user_detail.type]}}
          </div>
        </a-card-grid>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card class="card" hoverable>
        <a-card-grid style="width: 40%;text-align: center;background-color: #F56C6C">
          <BulbOutlined style="color: white;font-size: 50px"/>
        </a-card-grid>
        <a-card-grid style="width: 60%;text-align: right;background-color: #F2F6FC">
          管理的门店：
          <div style="font-weight: bold;color: #303133">
            {{user_detail.store_name}}
          </div>
        </a-card-grid>
      </a-card>
    </a-col>
    <a-col :span="8">
      <div :style="{ border: '1px solid #d9d9d9', borderRadius: '4px' }">
        <a-calendar v-model:value="value" :fullscreen="false" @panelChange="onPanelChange"/>
      </div>
    </a-col>
<!--    <a-col :span="16">-->
<!--      <div class="chartSection" ref="chart1">曲线图</div>-->
<!--    </a-col>-->
  </a-row>
</template>

<style scoped>
.chartSection {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>