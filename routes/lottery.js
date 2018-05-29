var express = require('express');

var request = require("request");

var { responseClient } = require("../utils/responseUtil");


var router = express.Router();

const submitUrl = 'http://apis.juhe.cn/lottery';

const appkey = 'ff693bc834d8257aa7f126cf66b73e1b';


/* 获取支持彩票列表并组装成菜单 */
router.get('/getMenu', function (req, res, next) {
    let urlPath = '/types';

    request(submitUrl + urlPath + '?key=' + appkey, function (error, response, body) {
        if (error) {
            // res.send(error);
        }
        if (body) {
            body = JSON.parse(body);
            let menuData = {};
            let allTypeList = [];
            if (body.result) {
                let length = body.result.length;
                for (let i = 0; i < length; i++) {
                    menuData[body.result[i].lottery_id] = body.result[i];
                    allTypeList.push(body.result[i].lottery_id);
                }
                menuData['menu_lotteryResults'] = {
                    name: '开奖结果',
                    url: '',
                    subMenu: [...allTypeList]
                }
                menuData['menu_winningCheck'] = {
                    name: '中奖查询',
                    url: '',
                    subMenu: [...allTypeList]
                }
                menuData['menu_calculate'] = {
                    name: '下期推算',
                    url: '',
                    subMenu: [...allTypeList]
                }
                menuData['menu_report'] = {
                    name: '彩票报表',
                    url: '',
                    subMenu: [...allTypeList]
                }
            }
            let menuList = [
                'menu_lotteryResults',
                'menu_winningCheck',
                'menu_calculate',
                'menu_report'
            ];

            responseClient(res, JSON.stringify({ menuData, menuList }));
        }
        //console.log(response.headers);
    })

});

module.exports = router;
