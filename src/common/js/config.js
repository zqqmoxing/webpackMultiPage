// module.exports = {
//     HTMLDirs:['page1','page2']
// }
//
let  fs = require('fs');
let path = require('path');
let _htmlRootPath = path.resolve(__dirname, '../../view/');
let _jsRootPath = path.resolve(__dirname, '');
let fileObj = {};
getRootDirect('html',_htmlRootPath);
getRootDirect('js',_jsRootPath);

//获取根文件夹
function getRootDirect(type,rootPath){
    // console.log(rootPath);
    let files = fs.readdirSync(rootPath);
    // console.log(files);

    let _director = [];
    //view下的文件夹名
    files.forEach(function (item, index) {
        let _path = path.resolve(rootPath , item);
        let stat = fs.lstatSync(_path);
        if (stat.isDirectory() === true) {
            _director.push({
                path:_path,
                name:item,
            })
        }
    });
    fileObj[type] = [];
    getFile(type,_director);
}

function getFile(type,_director){
    _director.forEach(function (directorItem, index) {
        let _directorPath = directorItem.path;
        let _directorName = directorItem.name;
        let files = fs.readdirSync(_directorPath);
        let _director1 = [];
        
        files.forEach(function (item, index) {
            let _path = path.resolve(_directorPath , item);
            let stat = fs.lstatSync(_path);
            if (stat.isDirectory() === true) {//文件夹
                _director1.push({
                    path:_path,
                    name:_directorName+'/'+item,
                });
            } else if(stat.isFile()){//文件
                fileObj[type].push({
                    file:_path,
                    path:_directorName,
                    fileName:item
                });
            }
        });
        if(_director1.length>0) {
            getFile(type,_director1);
        }
    });
}
console.log(fileObj)
module.exports={
    fileObj:fileObj
}