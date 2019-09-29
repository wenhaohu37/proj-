var express = require("express");
var setting = require("../libs/setting");
var mongoUtil = require("../libs/mongoUtil");
var dbutil = new mongoUtil(setting.host,setting.port,setting.dbname);

module.exports = (function(){
  var router = express.Router();
  router.use("/list",function(req,res){
    dbutil.find({category:req.category},{},"categories",function(err,result){
      if(err){
        res.status(500).send("数据库查询失败").end();
      }else{
        res.render("product-list.ejs",{categories:result});
      }
    });
  });

  router.use("/view",function(req,res){
    dbutil.find({pid:req.pid},{},"categories",function(err,result){
      if(err){
        res.status(500).send("数据库查询失败").end();
      }else{
        res.render("product-view.ejs",{categories:result});
      }
    });
  });
  return router;
})();