var fs = require('fs');
var path = require('path');
var qn = require('qn');
var logger = require('./logger');
var config = require('./config');

var client = qn.create(config.qnAccess);



var rootPath = __dirname + '/static';
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
                        client.uploadFile(newPath, {key : key}, function (err, result) {
                            if (err) {
                                console.log(err);
                                logger.error(' upload file:' + file + ',\nkey ' + key + ',\nerr' + err);
                            } else {
                                console.log('ok');
                                console.log(result.url);
                            }
                        });
                    }
                }
            } else if (stat.isDirectory()) {
                walkPath(newPath);
            }
        });
};
walkPath(rootPath);
