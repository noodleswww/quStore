var fs = require('fs');
var path = require('path');
var qn = require('qn');
var logger = require('./logger');
var config = require('./config');

var client = qn.create(config.qnAccess);


var rootPath = __dirname + '/static';
var upArr = [];
var walkPath = function (path) {
    fs.readdirSync(path)
        .forEach(function (file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if (stat.isFile()) {
                if (/js|css|common/.test(path)) {
                    if (/(.*)\.(js|coffee|css|png|jpg|jpeg|gif)/.test(file)) {
                        var start = newPath.indexOf('static/') + 7;
                        var key = newPath.substr(start);
                        console.log(key);
                        upArr.push({path:newPath,key:key})
                    }
                }
            } else if (stat.isDirectory()) {
                walkPath(newPath);
            }
        });
};
walkPath(rootPath);

function upDown(){
    console.log(upArr.length);
    var obj = upArr.shift();
    if(!obj)return;

    console.log(obj);
    client.uploadFile(obj.path, {key : obj.key}, function (err, result) {
        if (err) {
            console.log(err);
            logger.error(' upload file:' + obj.path + ',\nkey ' + obj.key + ',\nerr' + err);
            upDown();
        } else {
            console.log('ok');
            console.log(result.url);
            upDown();
        }
    });
}
upDown();