<template>
  <div>
    <el-row class="margin-bottom">
      <el-input v-model="inputWord"
                @keyup.enter="submit"
                @keyup.esc="clear"
                @keyup.up.stop="historyBefore"
                @keyup.down.stop="historyAfter"
                class="no-drag"></el-input>
    </el-row>
    <el-card v-if="result.length > 0"
             class="padding-top">
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
import query from '../plugins/pluginManager'
import { historyUp, historyDown, historyAdd, historyReset } from '../history'

export default {
  name: 'main-panel',
  data () {
    return {
      maxResultCount: 8,
      inputWord: '',
      result: []
    }
  },
  methods: {
    submit () {
      query(this.inputWord, res => {
        this.update(res)
        historyAdd(this.inputWord, res)
      })
    },
    clear () {
      this.inputWord = ''
      this.result.splice(0, this.result.length)
      historyReset()
    },
    update (res) {
      res = res.slice(0, this.maxResultCount)
      this.result.splice(0, this.result.length)
      this.result.push(...res)
    },
    historyBefore () {
      const { query, result } = historyUp()
      this.inputWord = query
      this.update(result)
    },
    historyAfter () {
      const { query, result } = historyDown()
      this.inputWord = query
      this.update(result)
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
