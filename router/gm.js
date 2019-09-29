var express = require("express");
var setting = require("../libs/setting");
var mongoUtil = require("../libs/mongoUtil");
var dbutil = new mongoUtil(setting.host,setting.port,setting.dbname);

module.exports = (function(){
  var router = express.Router();
  router.get("/add",function(req,res){
    dbutil.find({},{},"guests",function(err,result){
      if(err)throw err;
      res.render("guestbook.ejs",{users:result})
    });
  });

  router.post("/post",function(req,res){
    var user = req.body;
    dbutil.insert(user,"guests",function(err,result){
      if(err) throw err;
      res.redirect("http://localhost:9900/guestbook/add")
    });
  });
  return router;
})();