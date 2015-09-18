var fs = require('fs');
var path = require('path');
var qn = require('qn');
var logger = require('./logger');

var client = qn.create({
    accessKey : '5ZtczyWc3w1Tpb_4hrRowbAhQVG70wb6Btd6fmdt',
    secretKey : 'hFS_bQKBYPGZsk-Th1MAHoVJiOtzdJiOTVfRMTAg',
    bucket : 'homecdn',
    domain : '7xk6xr.com1.z0.glb.clouddn.com'
});


var models_path = __dirname + '/static';
var walk = function (path) {
    fs.readdirSync(path)
        .forEach(function (file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if (stat.isFile()) {
                if (/common|js|css/.test(path)) {
                    if (/(.*)\.(js|coffee|css|png|jpg|jpeg|gif)/.test(file)) {
                        var start = newPath.indexOf('static/') + 7;
                        var key = newPath.substr(start);
                        client.uploadFile(file, {key : key}, function (err, result) {
                            if (err) {
                                console.log(data.key);
                                logger.error(' upload ', ' file ',data.file,data.key);
                            }else{
                                console.log('ok');
                            }
                        });
                    }
                }
            }
            else if (stat.isDirectory()) {
                walk(newPath);
            }
        });
};
walk(models_path);