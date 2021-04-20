<template>
  <div>
    <el-row>
      <el-input v-model="inputWord"
                @keyup.enter="submit"
                @keyup.esc="clear"></el-input>
    </el-row>
    <el-row type="flex"
            justify="space-around">
      <el-col :span="24">
        <el-card v-for="res in result"
                 :key="res"
                 shadow="hover">
          <div class="align-left">
            {{ res }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'main-panel',
  data () {
    return {
      inputWord: '',
      result: ['result1', 'result2']
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
.el-card__body {
  padding: 5px 15px;
}
.align-left {
  text-align: left;
}
</style>
