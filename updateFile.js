
var filename = process.argv.pop();
var path = require('path');
var readline = require('readline');
var qn = require('qn');
var logger = require('./logger');
var config = require('./config');

var client = qn.create(config.qnAccess);

console.log('输入文件完整路径：');
var rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
    terminal : false
});
rl.prompt();
rl.on('line', function (line) {
    updateFile(line);
});
function updateFile(file) {
    console.log('正在上传文件...', file);
    var start = file.indexOf('static/') + 7;
    var key = file.substr(start);
    var newPath = path.join(__dirname, file);

    console.log('正在删除远程文件...');
    client.delete(key, function (err) {
        if (err) {
            logger.error('delete file fail ,' + key + ',err: ' + err);
            console.log('删除错误，请重试！\n' + err);
            rl.pause();
            return;
        }
        console.log('删除远程文件成功！，正在上传新文件...');
        client.uploadFile(newPath, {key : key}, function (err, result) {
            if (err) {
                console.log(err);
                logger.error(' upload ' + file + ',,key ' + key);
                rl.pause();
                return;
            }
            console.log('修改成功！\n地址为：' + result.url);
            rl.pause();
        });
    });

}