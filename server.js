var express = require("express");
var expstatic = require("express-static");
var bodyParser = require("body-parser");
var multer = require("multer");
var fs = require("fs")//文件系统
var path = require("path");// 文件路径
var consolidate = require("consolidate");
var ejs = require("ejs");
var cookieParser = require("cookie-parser");
var session = require("cookie-session");

//创建服务器
var server = express();
server.listen(9900);


var upload = multer({dest:'./www/upload'});

//解析请求中的数据
// get有express
// bodyParser处理post提交的数据
server.use(bodyParser.urlencoded({extended:false}));
// multer处理multipart/form-data
server.use(upload.any());

//设置模板引擎
server.set("view engine","html");
server.set("views","./templates");
server.engine("html",consolidate.ejs);

//从请求中解析cookie和session数据
// server.use(cookieParser());
// (function(){
//    var keys =[];
//    for(var i = 0; i < 10000; i++){
//       keys.push("key" + i);
//    }
//
//    server.use(session({
//       name:'sess_id',
//       keys:keys,
//       maxAge:20*60*1000
//    }));
// })();

//路由

server.use("/category",require("./router/cm"));//分类管理
server.use("/manger",require("./router/mm"));//用户管理
server.use("/news",require("./router/nm"));//新闻管理
server.use("/note",require("./router/message"));//留言管理
server.use("/index",require("./router/im"));//首页
server.use("/order",require("./router/om"));//订单管理
server.use("/view",require("./router/vm"));//公告
server.use("/list",require("./router/lm"));//商品列表
server.use("/guestbook",require("./router/gm"));//留言板
server.use("/user",require("./router/um"));//登录注册
server.use("/product",require("./router/pm"));//商品管理
//静态资源处理
server.use(expstatic('./www'));



 