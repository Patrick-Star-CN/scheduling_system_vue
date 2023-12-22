<template>
  <router-view v-if="isRouterAlive"/>
</template>
<script>
export default {

  data() {
    return {
      isRouterAlive: true
    };
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
  }
}
</script>
<style>
  #app{
    height: 100%;
    width: 100%;
  }
</style>