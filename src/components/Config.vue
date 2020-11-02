<template>
  <div class="Config">
    <el-button size="mini" type="primary" icon="el-icon-plus" @click="addRule">新增规则</el-button>
    <el-button size="mini" @click="importRule">导入规则</el-button>
    <el-button size="mini" @click="exportRule">导出规则</el-button>
    <el-table
        row-key="id"
        ref="table"
        :data="rules"
        style="width: 100%">
      <el-table-column
          prop="rule"
          label="匹配规则(支持正则)"
          min-width="100">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.rule"></el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="path"
          label="移动路径(相对/绝对路径)"
          min-width="200">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.path"></el-input>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          min-width="80">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-rank" class="move-handle"></el-button>
          <el-button size="mini" type="danger" @click="delRule(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    <el-input v-model="rulesJson" @change="changeRulesJson"></el-input>-->
  </div>
</template>

<script type="text/ecmascript-6">
import Sortable from 'sortablejs';
export default {
  name: "Config",
  data(){
    return {
      rules: [
        {id: 1, rule: "jpg|png|jpeg|gif", path: "图片"},
        {id: 2, rule: "txt|doc|cmd", path: "文档"},
        {id: 3, rule: "*", path: "其他"}
      ]
    }
  },
  watch:{
    rules:{
      handler(newName, oldName) {
        //保存
        window.utils.db("rules",this.rules);
      },
      deep: true
    }
  },
  mounted(){
    this.rules = window.utils.db("rules");
    this.rulesJson = JSON.stringify(this.rules);

    this.startDragable();
  },
  methods: {
    startDragable(){
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        handle: ".move-handle",
        onEnd({newIndex,oldIndex}) {
          const targetRows = _this.rules.splice(oldIndex, 1);
          _this.rules.splice(newIndex, 0, targetRows[0]);
        }
      })
    },
    addRule(){
      this.rules.push({
        id: Date.now() + Math.random(),
        rule: "",
        path: ""
      })
    },
    delRule(index){
      this.rules.splice(index,1);
    },

    // 导出规则
    exportRule(){
      this.$prompt('请自行复制下面的JSON规则', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: JSON.stringify(this.rules),
        inputType: 'textarea'
      })
    },
    // 导入规则
    importRule(){
      this.$prompt('导入规则', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入规则JSON'
      }).then(({ value }) => {
        let list = JSON.parse(value);
        if (list){
          this.rules = list;
          this.$message.success("导入成功");
        }else{
          this.$message.error("导入失败");
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.Config{
  .el-table__row .el-input__inner{
    border: unset;
  }
  .move-handle{
    cursor: move;
  }
}
</style>
