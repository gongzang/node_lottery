module.exports = {
    responseClient(res, data = {},httpCode = 200, code = 3, message = '服务端异常', ) {
        res.writeHead(httpCode, { "Content-Type": "text/plain;charset=UTF-8" });
        res.write(data);
        res.end();
    }

}