<template>
  <div>
    <el-row class="margin-bottom">
      <el-input v-model="inputWord"
                @keyup.enter="submit"
                @keyup.esc="clear"
                class="no-drag"></el-input>
    </el-row>
    <el-card class="padding-top">
      <el-space direction="vertical"
                alignment="start">
        <div class="result-item"
             v-for="res in result"
             :key="res">
          {{ res }}
        </div>
      </el-space>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'main-panel',
  data () {
    return {
      maxResultCount: 10,
      inputWord: '',
      result: ['result1', 'result2', 'result1', 'result2', 'result1', 'result2', 'result1', 'result2', 'result1', 'result2']
    }
  },
  methods: {
    submit () {
      console.log(this.inputWord)
    },
    clear () {
      this.inputWord = ''
    }
  }
}
</script>

<style>
.result-item {
  text-align: left;
  padding: 5px 15px;
  background: white;
}
.margin-bottom {
  margin-bottom: 5px;
}
.padding-top {
  padding-top: 5px;
}
.no-drag {
  -webkit-app-region: no-drag;
}
.el-card__body {
  padding: 0;
  text-align: left;
}
</style>
