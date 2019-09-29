var express = require("express");
var mongoUtil = require("../libs/mongoUtil");
var setting = require("../libs/setting");
var dbutil = new mongoUtil(setting.host,setting.port,setting.dbname);
var ObjectID = require("mongodb").ObjectID;

module.exports = (function (){
  //创建一个路由的对象
  var r2 = express.Router();

  r2.use("/list",function (req,res) {
    dbutil.find({},{},"notes",function (err,data) {
      if(err){
        res.status(404).send("数据库访问失败").end();
      }else{
        res.render("note_list.ejs",{guests:data});
      }
    });
  });

//处理删除请求
  r2.use("/del",function (req,res) {
    dbutil.delete({_id:new ObjectID(req.query.id)},"notes",function (err,data) {
      if (err) {
        res.status(500).send("数据库删除失败").end();
      } else{
        res.redirect("http://localhost:9900/note/list");
      }
    });
  });

//发起修改请求
//接收浏览器提交的id值，到mongodb中按照id查找用户数据
//将用户数据和模板文件(表单和表单元素)合并
  r2.get("/response",function (req,res) {
    dbutil.find({_id:new ObjectID(req.query.id)},{},"notes",function(err,data) {
      if(err){
        res.status(500).send("数据库访问失败").end();
      }else{
        res.render("note_update.ejs",{note:data[0]});//渲染新增页面
      }
    });
  });

//响应修改请求
  r2.post("/response",function (req,res) {
    var admin = req.body;
    console.log(admin)
    dbutil.find({},{sort:{aid:-1},limit:1},"admins",function(err,result) {
      if (err) {
        res.state(500).send("数据库查询失败").end();
      } else {
        admin.aid = result[0].aid + 1;
        dbutil.insert(admin, "admins", function (err, result) {
          if (err) {
            res.state(500).send("数据库新增失败").end();
          } else {
            res.redirect("http://localhost:9900/note/list");
          }
        });
      }
    });
  });
  return r2;
})();