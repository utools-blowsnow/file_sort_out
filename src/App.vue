<template>
  <div id="app">
    <config v-if="type === 1"></config>
    <log v-if="type === 2" :logs="logs"></log>
  </div>
</template>

<script>

import Config from "./components/Config";
import Log from "@/components/Log";
export default {
  name: 'app',
  components: {Log, Config},
  data(){
    return {
      type: 0,
      logs: []
    }
  },
  mounted(){
    utools.onPluginReady(() => {
      this.type = 1;
      if (!window.utils.db("rules")){
        let rules = [
          {id: 1, rule: ".(jpg|png|jpeg|gif)", path: "图片"},
          {id: 2, rule: ".(txt|doc|cmd)", path: "文档"},
          {id: 3, rule: ".*", path: "其他"}
        ]
        window.utils.db("rules",rules);
      }

    })


    utools.onPluginEnter(({code, type, payload, optional}) => {
      console.log('用户进入插件', code, type, payload)
      if (type === "files"){
        this.type = 2;
        this.moveFiles(payload);
      }else{
        this.type = 1;
      }
    })
  },
  methods:{
    async moveFiles(files){
      for(let file of files){
        if (file.isDirectory) continue;
        let rule = this.matchRule(file.name);
        if (rule){
          try {
            this.moveFile(file,rule.path);
          }catch (e){
            console.log(e);
          }
        }
      }
    },
    moveFile(file,path){
      console.log(file,path);
      let dir = window.utils.file.dirname(file.path);
      let newdir = window.utils.file.resolve(dir,path);
      let newdirpath = window.utils.file.join(newdir,file.name)

      console.log(file.path,newdirpath);

      window.utils.file.moveFile(file.path,newdirpath);

      this.logs.push({
        old_path: file.path,
        path: newdirpath
      })
    },
    matchRule(name){
      const rules = window.utils.db("rules");
      for(let rule of rules){
        let regexp = new RegExp(rule.rule,"i")
        if (regexp.test(name)){
          return rule;
        }
      }
      return false;
    }
  }
}
</script>

<style>

</style>
