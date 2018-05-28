var express = require('express');

var request = require("request");

var {responseClient} = require("../utils/responseUtil");


var router = express.Router();

const submitUrl = 'http://apis.juhe.cn/lottery';

const appkey = 'ff693bc834d8257aa7f126cf66b73e1b';


/* 获取支持彩票列表 */
router.get('/types', function (req, res, next) {
    let urlPath = '/types';

    request(submitUrl + urlPath + '?key=' + appkey, function (error, response, body) {
        if (error) {
            // res.send(error);
        }
        if(body){
            responseClient(res,body);
        }
        //console.log(response.headers);
    })

});

module.exports = router;
