var express = require("express");
var setting = require("../libs/setting");
var mongoUtil = require("../libs/mongoUtil");
var dbutil = new mongoUtil(setting.host,setting.port,setting.dbname);

module.exports = (function(){
  var router = express.Router();
  router.use("/",function(req,res){
    dbutil.find({},{},"categories",function(err,result){
      if(err){
        res.status(500).send("数据库查询失败").end();
      }else{
        res.render("index.ejs",{categories:result});
      }
    });
  });

  // router.use("/",function(req,res,next){
  //   dbutil.find({},{},"products",function(err,result){
  //     if(err){
  //       res.status(500).send("数据库查询失败").end();
  //     }else{
  //       res.render("index.ejs",{products:result});
  //       next();
  //     }
  //   });
  // });
  //
  // router.use("/",function (req,res) {
  //   dbutil.find({},{sort:{nid:1}},"news",function(err,result){
  //     if (err) {
  //       res.status(500).send("数据库查询失败").end();
  //     }else{
  //       res.render("index.ejs",{news:result});
  //     }
  //   });
  // });
  // router.use("/",function (req,res) {
  //   dbutil.findMoreCol([],[],["news","categories","notes"],function(err,result){
  //     if (err) {
  //       res.status(500).send("数据库查询失败").end();
  //     }else{
  //       console.log("查询结果",result)
  //       res.render("index.ejs",{news:result[0]});
  //     }
  //   });
  // });

  return router;
})();