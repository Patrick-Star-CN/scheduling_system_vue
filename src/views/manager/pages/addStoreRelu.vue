<script>
import axios from "axios";
import {message} from "ant-design-vue";

export default {
  inject: ["reload"],
  data() {
    return {
      rule: {
        openStore: {
          time: 0,
          count: 0,
          formula: 0.0
        },
        closeStore: {
          time: 0,
          count: 0,
          formula: 0.0
        },
        passenger: {
          time: 0,
          count: 0,
          formula: 0.0
        }
      }
    }
  },
  methods: {
    get() {
      axios.get('/api/store/rule', {})
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              this.rule = this.data.data;
              console.log(this.rule)
            } else {
              message.warn("查询门店的规则信息失败")
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
    change() {
      axios.post('/api/store/rule', {
        open_store: this.rule.openStore,
        close_store: this.rule.closeStore,
        passenger: this.rule.passenger,
      })
          .then(response => {
            this.data = response.data;
            if (this.data.msg === "success") {
              message.success("更新门店的规则信息成功")
            } else {
              message.warn("查询门店的规则信息失败")
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    }
  },
  created() {
    this.get()
  }
}
</script>

<template>
  <a-flex justify="center">
    <h2 style="font-weight: bold;font-size: 25px;letter-spacing: 8px">
      增加门店规则
    </h2>
  </a-flex>
  <a-flex justify="center">
    <a-form :label-col="{ span: 800 }"
            :wrapper-col="{ span: 800 }"
            autocomplete="off"
            :model="rule">
      <a-row>
        <a-col :span="200" :offset="0">
          <label style="font-size: 20px;font-weight: bold;letter-spacing: 5px">开店规则</label>
        </a-col>
      </a-row>
      <br>
      <a-row>
        <a-col :span="9" :offset="0">
          <a-form-item
              label="分&emsp;&emsp;钟"
              name="分钟"
          >
            <a-input-number v-model:value="rule.openStore.time"/>
          </a-form-item>
        </a-col>
        <a-col :span="9" :offset="0">
          <a-form-item
              label="最少人数"
              name="分钟"
          >
            <a-input-number v-model:value="rule.openStore.count"/>
          </a-form-item>
        </a-col>
        <a-col :span="5" :offset="0">
          <a-form-item
              label="平方米/人"
              name="分钟"
          >
            <a-input-number :min="0"
                            :max="10"
                            :step="0.1"
                            string-mode v-model:value="rule.openStore.formula"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="10" :offset="0">
          <label style="font-size: 20px;font-weight: bold;letter-spacing: 5px">关店规则</label>
        </a-col>
      </a-row>
      <br>
      <a-row>
        <a-col :span="9" :offset="0">
          <a-form-item
              label="分&emsp;&emsp;钟"
              name="分钟"
          >
            <a-input-number v-model:value="rule.closeStore.time"/>
          </a-form-item>
        </a-col>
        <a-col :span="9" :offset="0">
          <a-form-item
              label="最少人数"
              name="分钟"
          >
            <a-input-number v-model:value="rule.closeStore.count"/>
          </a-form-item>
        </a-col>
        <a-col :span="5" :offset="0">
          <a-form-item
              label="平方米/人"
              name="分钟"
          >
            <a-input-number :min="0"
                            :max="10"
                            :step="0.1"
                            string-mode v-model:value="rule.closeStore.formula"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12" :offset="0">
          <label style="font-size: 20px;font-weight: bold;letter-spacing: 5px">客流规则</label>
        </a-col>
      </a-row>
      <br>
      <a-row>
        <a-col :span="9" :offset="0">
          <a-form-item
              label="最少人数"
              name="分钟"
          >
            <a-input-number v-model:value="rule.passenger.count"/>
          </a-form-item>
        </a-col>
        <a-col :span="9" :offset="0">
          <a-form-item
              label="客&ensp; 流/人"
              name="分钟"
          >
            <a-input-number :min="0"
                            :max="10"
                            :step="0.1"
                            string-mode v-model:value="rule.passenger.formula"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-flex justify="center">
        <a-form-item>
          <a-button type="primary" html-type="submit" @click="change">保存</a-button>
        </a-form-item>
      </a-flex>
    </a-form>
  </a-flex>
</template>

<style scoped>

</style>