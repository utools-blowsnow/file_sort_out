<template>
  <div class="Log">
    <el-table
        row-key="id"
        ref="table"
        :data="logs"
        style="width: 100%">
      <el-table-column
          type="index"
          label="序号"
          width="60">
      </el-table-column>
      <el-table-column
          prop="old_path"
          label="原文件路径"
          min-width="200">
      </el-table-column>
      <el-table-column
          prop="path"
          label="新文件路径"
          min-width="200">
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "Log",
  props:['logs'],
  mounted(){

  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.Log{

}
</style>
