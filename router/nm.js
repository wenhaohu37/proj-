var express = require("express");
var mongoUtil = require("../libs/mongoUtil");
var setting = require("../libs/setting");
var dbutil = new mongoUtil(setting.host,setting.port,setting.dbname);
var ObjectID = require("mongodb").ObjectID;

module.exports = (function(){
  var router = express.Router();

  router.get("/add",function(req,res){
    var news = {title:"",content:""};
    res.render("news_add.ejs",{news:news,errInfo:""});
  });
  // post 提交数据，处理新类别数据
  router.post("/add",function(req,res){
    var news = req.body;
    if(news.title.trim().length === 0) {
      res.render("news_add.ejs", {news: news, errInfo: "新闻标题不得为空"});
    }else if(news.content.trim().length === 0) {
      res.render("news_add.ejs", {news: news, errInfo: "新闻内容不得为空"});
    }else{
      //新类别的nid = max(已有nid)+1
      dbutil.find({},{sort:{nid:-1},limit:1},"news",function(err,result){
        if(err){
          res.state(500).send("数据库查询错误").end();
        }else{
          news.nid = result[0].nid + 1;
          dbutil.insert(news,"news",function(err,result){
            if(err){
              res.state(500).send("数据库新增错误").end();
            }else{
              res.redirect("http://localhost:9900/manage-result.html");
            }
          });
        }
      });
    }
  });

  //显示列表
  router.use("/list",function (req,res) {
    dbutil.find({},{},"news",function (err,data) {
      if(err){
        throw err;
      }else{
        res.render("news_list.ejs",{news:data});
      }
    });
  });

  //删除
  router.use("/del",function (req,res) {
    dbutil.delete({_id:new ObjectID(req.query.id)},"news",function (err,data) {
      if (err) {
        throw err;
      } else{
        res.redirect("http://localhost:9900/news/list");
      }
    });
  });

  //发起修改请求
  //接收浏览器提交的id值，到mongodb中按照id查找用户数据
  //将用户数据和模板文件(表单和表单元素)合并
  router.get("/update",function (req,res) {
    dbutil.find({_id:new ObjectID(req.query.id)},{},"news",function(err,data) {
      if(err){
        throw err;
      }else{
        res.render("news_update.ejs",{news:data[0],errInfo:""});//渲染新增页面
      }
    });
  });

//响应修改请求
  router.post("/update",function (req,res) {
    var news = req.body;
    dbutil.update({_id:new ObjectID(req.body.id)},
      {$set:{
          title:news.title,content:news.content
        }},"news",
      function(err,data){
        if(err){
          throw err;
        }else{
          res.redirect("http://localhost:9900/manage-result.html");
        }
      });
  });
  return router;
})();