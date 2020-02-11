

const Http = require('http');
const Url = require('url');
const Qs = require('qs');
const Main = require("./main.js");
const Port = 8800;

let repResult = function (res, returnVal) {
    res.writeHead(200, {
        //'content-type': 'application/json;charset=utf-8;'

        'content-type': 'text/plain;charset=utf-8;'
    });
    res.end(JSON.stringify(returnVal));
};

//=>创建WEB服务
let handle = function (req, res) {
    let {method, headers: requestHeaders} = req,
        {pathname, query} = Url.parse(req.url, true),
        pathREG = /\.([a-z0-9]+)$/i;

    //// API接口请求处理
    console.log('===> pathName =', pathname, query);
    
    if (pathname === '/getOptionals' && method === 'GET') {
        //=>问号传递的信息都在QUERY中存储着
        let {seleDate = ''} = query;

       	let runData = Main.getOptionals(seleDate);
        let returnVal = {code: 0, message: 'OK', data:runData};
        repResult(res, returnVal);
        return ;
    }

    //
    if (pathname === '/subscribeOption' && method === 'POST') {
        //=>接收客户端请求主体传递的内容
        let pass = ``;
        req.on('data', chunk => {
            pass += chunk;
        });
        req.on('end', () => {
            //=>已经把请求主体内容接收完成了  PASS是一个URLENCODED格式字符串，我们需要把它解析为对象
            pass = Qs.parse(pass);

            let seleDate = pass.seleDate;
            let hours = pass.hours;
            let selectIds = pass.selectIds;
            let resCode = Main.selectOptional(seleDate, hours, selectIds);
            let returnVal = {code: resCode, message: 'OK'};
            if(resCode != 200){
            	returnVal.message = Main.messageData[resCode] || 'DataErr';
            }
	        repResult(res, returnVal);
	        return;
        });
        return;
    }

    //=>请求的都不是以上API接口,直接404即可
    res.writeHead(404);
    res.end('');
};


Http.createServer(handle).listen(Port, () => {
    console.log(`server is success，listen on ${Port}！`);
});

//console.log('====> global = ', Main.globalOptional)