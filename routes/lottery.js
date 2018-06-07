var express = require('express');

var request = require("request");

var mcache = require('memory-cache');

var { responseClient } = require("../utils/responseUtil");


var router = express.Router();

const submitUrl = 'http://apis.juhe.cn/lottery';

const appkey = 'ff693bc834d8257aa7f126cf66b73e1b';


/* 获取支持彩票列表并组装成菜单 */
router.get('/getMenu', function (req, res, next) {
    let urlPath = '/types';

    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
        responseClient(res, JSON.stringify(cachedBody));
        return;
    } else {
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
                        url: 'results',
                        subMenu: [...allTypeList]
                    }
                    menuData['menu_winningCheck'] = {
                        name: '中奖查询',
                        url: 'results',
                        subMenu: [...allTypeList]
                    }
                    menuData['menu_calculate'] = {
                        name: '下期推算',
                        url: 'results',
                        subMenu: [...allTypeList]
                    }
                    menuData['menu_report'] = {
                        name: '彩票报表',
                        url: 'results',
                        subMenu: [...allTypeList]
                    }
                }
                let menuList = [
                    'menu_lotteryResults',
                    'menu_winningCheck',
                    'menu_calculate',
                    'menu_report'
                ];

                mcache.put(key, { menuData, menuList });
                responseClient(res, JSON.stringify({ menuData, menuList }));
            }
        });
    }


});

/* 根据期号获取彩票相应的彩种的开奖数据 */
router.get('/queryLotteryResult', function (req, res, next) {
    requestQuerySync(req).then(result => {
        let maxNo = mcache.get(result.lottery_id);
        if (maxNo) {
            result.maxNo = maxNo;
        }
        responseClient(res, JSON.stringify(result));
    });

});

function requestQuerySync(req) {
    return new Promise((resolve, reject) => {
        let urlPath = '/query';

        request(`${submitUrl}${urlPath}?key=${appkey}&lottery_id=${req.query.lottery_id}${req.query.lottery_no ? ('&lottery_no=' + req.query.lottery_no) : ''}`, function (error, response, body) {
            if (error) {
            }
            if (body) {
                body = JSON.parse(body);
                let menuData = {};
                let allTypeList = [];
                let result = body.result;
                if (result) {
                    let tempArr = result.lottery_res.split(',');
                    result.lotteryResArr = [];
                    for (let i = 0; i < tempArr.length; i++) {
                        result.lotteryResArr.push(tempArr[i].split(''));
                    }
                    result.lotteryMessage = [];
                    result.lotteryMessage.push(`开奖日期 : ${result.lottery_date}`);
                    result.lotteryMessage.push(`本期全国销售金额 : ${result.lottery_sale_amount}`);
                    result.lotteryMessage.push(`${result.lottery_pool_amount}元奖金滚入下期奖池。`);
                    result.lotteryMessage.push(`本期兑奖截止日为${result.lottery_exdate}，逾期作弃奖处理。`);

                    result.lottery_no = parseInt(result.lottery_no);
                }
                resolve(result);
            }
        });
    });

}


/* 获取彩票相应的彩种的最新开奖数据 */
router.get('/queryNewest', function (req, res, next) {
    let urlPath = '/query';
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
        responseClient(res, JSON.stringify(cachedBody));
        return;
    } else {
        requestQuerySync(req).then(result => {
            mcache.put(key, result);
            let maxNo = mcache.get(result.lottery_id);
            if (maxNo) {
                result.maxNo = maxNo;
            } else {
                mcache.put(result.lottery_id, result.lottery_no);
                result.maxNo = result.lottery_no;
            }
            responseClient(res, JSON.stringify(result));
        });
    }

});


module.exports = router;
