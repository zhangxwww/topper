<template>
  <main-panel></main-panel>
</template>

<script>
import MainPanel from './components/MainPanel.vue'

export default {
  name: 'App',
  components: {
    MainPanel
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  border-radius: 30px;
}
body {
  background: #00000000;
  margin: 0;
  border-radius: 30px;
  -webkit-app-region: drag;
}
</style>
