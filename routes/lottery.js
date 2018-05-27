var express = require('express');

var request = require("request");


var router = express.Router();

const submitUrl = 'http://apis.juhe.cn/lottery';

const appkey = '**********';


/* 获取支持彩票列表 */
router.get('/types', function (req, res, next) {
    let urlPath = '/types';

    request(submitUrl + urlPath + '?key=' + appkey, function (error, response, body) {
        if (error) {
            // res.send(error);
        }
        if(body){
            res.writeHead(200, {"Content-Type": "text/plain;charset=UTF-8"});  
            res.write(body);
            res.end(); 
        }
        //console.log(response.headers);
    })

});

module.exports = router;
