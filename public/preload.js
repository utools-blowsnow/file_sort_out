const { ipcRenderer, remote, clipboard, shell,dialog } = require('electron')
const fs = require('fs')
const path = require('path')
const process = require('process');

window.utils = {
    clipboard: {
        writeText: (text) => {
          clipboard.writeText(text)
        }
    },
    showDialog: (type,title,message,buttons,callback) => {
        dialog.showMessageBox({
            type: type,
            title: title,
            message: message,
            buttons: buttons
        },callback);
    },
    showOpenDialog: (name='文件',extensions=[]) => {
        return dialog.showOpenDialog(remote.getCurrentWindow(), { filters: [{ 'name': name, extensions: extensions }], properties: ['openFile'] })
    },
    showMssage:(text,title='utools')=>{
        notifier.notify(
         {
           title: title,
           subtitle: 'utools',
           message: text,
           sound: true,
           wait: true
         },
         function (err, response) {
           if (err) {
             console.log(err)
           }
         }
        )
    },
    openExternal: shell.openExternal,
    openDefaultBrowser: function (url) {
        var exec = require('child_process').exec;
        switch (process.platform) {
          case "darwin":
            exec('open ' + url);
            break;
          case "win32":
            exec('start ' + url);
            break;
          default:
            exec('xdg-open', [url]);
        }
    },
    file:{
        readFile:(pathObj)=>{
            var bitmap = fs.readFileSync(pathObj.path);
            var file = new File(bitmap,pathObj.name);
            console.log("readFile",bitmap,file)
            return file;
        },
        moveFile(filepath,newfilepath){
            this.mkdirsSync(this.dirname(newfilepath));
            return new Promise(resolve => {
                var readStream = fs.createReadStream(filepath);
                var writeStream = fs.createWriteStream(newfilepath);
                readStream.pipe(writeStream);
                readStream.on('end',function(){
                    fs.unlinkSync(filepath);
                    resolve();
                });
            })
        },
        resolve(...paths){
            return path.resolve(...paths);
        },
        dirname(filepath){
            return path.dirname(filepath);
        },
        join(...paths){
            return path.join(...paths);
        },
        scanDirFiles: (dir,excludes=[])=>{
            var that = this;
            var list = [] , files = fs.readdirSync(dir);
            files.forEach((filename) =>{
                let filepath = path.join(dir,filename);
                try {
                    var stats = fs.statSync(filepath);
                }catch (e){
                    console.log(e);
                    return;
                }
                //是文件
                if(stats.isFile()){
                    list.push(filepath);
                }else if(stats.isDirectory()){
                    for(let exclude of excludes){
                        let regexp = new RegExp(exclude,"i")
                        if (regexp.test(filepath)) return;
                    }
                    list.push(...utils.scanDirFiles(filepath,excludes));
                }
            });
            return list
        },
        existsSync(path){
            return fs.existsSync(path);
        },

        mkdirsSync(dirname) {
            if (fs.existsSync(dirname)) {
                return true;
            } else {
                if (this.mkdirsSync(path.dirname(dirname))) {
                    fs.mkdirSync(dirname);
                    return true;
                }
            }
        }
    },
    db: function(name,value=undefined){
        let obj = utools.db.get(name);
        if (value !== undefined){
            let putdata = {
                _id: name,
                data: value,
            }
            if (obj && obj._rev){
                putdata._rev = obj._rev;
            }
            utools.db.put(putdata)
            return;
        }
        if (obj == null) return null;
        return obj.data;
    }
}

