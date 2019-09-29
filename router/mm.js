var express = require("express");
var mongoUtil = require("../libs/mongoUtil");
var setting = require("../libs/setting");
var dbutil = new mongoUtil(setting.host,setting.port,setting.dbname);
var ObjectID = require("mongodb").ObjectID;
var fs = require("fs")//文件系统
var path = require("path");// 文件路径
var multer = require("multer");

module.exports = (function (){
  //创建一个路由的对象
  var r2 = express.Router();

  r2.use("/list",function (req,res) {
    dbutil.find({},{},"mangers",function (err,data) {
      if(err){
        res.status(404).send("数据库访问失败").end();
      }else{
        res.render("manger_list.ejs",{user:data});
      }
    });
  });

//发起新增请求
  r2.get("/add",function (req,res) {
    res.render("manger_add.ejs",{user:"",errInfo:""});//渲染新增页面
  });

//响应新增请求
  r2.post("/add",function (req,res) {
    var user = req.body;
    //添加头像
    if(!req.files[0] === false){
      var extName = path.extname(req.files[0].originalname);
      var newName = req.files[0].path + extName;
      fs.rename(req.files[0].path,newName,function(err,data){
        if(err)  throw err;
      });
    }
    user.photo = newName;
    if(user.account.trim().length === 0){
      //用户名为空，重新显示新增的表单
      res.render("manger_add.ejs",{user:user, errInfo:"用户名不得为空!"});
    }else if(user.realName.trim().length === 0){
      //姓名为空，重新显示新增的表单
      res.render("manger_add.ejs",{user:user, errInfo:"姓名不得为空!"});
    }else if(user.pwd.trim().length < 6 || user.pwd.trim().length > 12){
      //密码长度小于6位或者大于12位，重新显示新增的表单
      res.render("manger_add.ejs",{user:user, errInfo:"密码长度必须为6~12位!"});
    }else if(user.mobile.trim().length === 0){
      //手机号为空，重新显示新增的表单
      res.render("manger_add.ejs",{user:user, errInfo:"手机号码不得为空!"});
    }else if(user.address.trim().length === 0){
      //送货地址为空，重新显示新增的表单
      res.render("manger_add.ejs",{user:user, errInfo:"送货地址不得为空!"});
    }else {
      //新类别的mid = max(已有mid)+1
      dbutil.find({},{sort:{mid:-1},limit:1},"mangers",function(err,result){
        if(err){
          res.state(500).send("数据库查询失败").end();
        }else{
          user.parentId = parseInt(user.parentId);
          user.mid = result[0].mid + 1;
          dbutil.insert(user,"mangers",function(err,result){
            if(err){
              res.state(500).send("数据库新增失败").end();
            }else{
              res.redirect("http://localhost:9900/manger/list");
            }
          });
        }
      });
    }
  });

//处理删除请求
  r2.use("/del",function (req,res) {
    dbutil.delete({_id:new ObjectID(req.query.id)},"mangers",function (err,data) {
      if (err) {
        res.status(500).send("数据库删除失败").end();
      } else{
        res.redirect("http://localhost:9900/manger/list");
      }
    });
  });

//发起修改请求
//接收浏览器提交的id值，到mongodb中按照id查找用户数据
//将用户数据和模板文件(表单和表单元素)合并
  r2.get("/update",function (req,res) {
    dbutil.find({_id:new ObjectID(req.query.id)},{},"mangers",function(err,data) {
      if(err){
        res.status(500).send("数据库访问失败").end();
      }else{
        res.render("manger_update.ejs",{user:data[0],errInfo:""});//渲染新增页面
      }
    });
  });

//响应修改请求
  r2.post("/update",function (req,res) {
    var user = req.body;
    //头像
    if(!req.files[0] === false){
      var extName = path.extname(req.files[0].originalname);
      var newName = req.files[0].path + extName;
      fs.rename(req.files[0].path,newName,function(err,data){
        if(err)  throw err;
      });
    }
    user.photo = newName;

    if(user.account.trim().length === 0){
      //用户名为空，重新显示新增的表单
      res.render("manger_update.ejs",{user:user, errInfo:"用户名不得为空!"});
    }else if(user.realName.trim().length === 0){
      //姓名为空，重新显示新增的表单
      res.render("manger_update.ejs",{user:user, errInfo:"姓名不得为空!"});
    }else if(user.pwd.trim().length < 6 || user.pwd.trim().length > 12){
      //密码长度小于6位或者大于12位，重新显示新增的表单
      res.render("manger_update.ejs",{user:user, errInfo:"密码长度必须为6~12位!"});
    }else if(user.mobile.trim().length === 0){
      //手机号为空，重新显示新增的表单
      res.render("manger_update.ejs",{user:user, errInfo:"手机号码不得为空!"});
    }else if(user.address.trim().length === 0){
      //送货地址为空，重新显示新增的表单
      res.render("manger_update.ejs",{user:user, errInfo:"送货地址不得为空!"});
    }else {
      dbutil.update({_id:new ObjectID(req.body.id)},
        {$set:{
            account:user.account,pwd:user.pwd,mobile:user.mobile,realName:user.realName,gender:user.gender,birthday:user.birthday,photo:user.photo
          }},"mangers",
        function(err,data){
          if(err){
            res.status(500).send("数据库修改失败").end();
          }else{
            res.redirect("http://localhost:9900/manage-result.html");
          }
        });
    }
  });
  return r2;
})();