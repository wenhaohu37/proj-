var express=require("express");
var mongoUtil = require("../libs/mongoUtil");
var dbutil=new mongoUtil("localhost","27017","easybuy");

module.exports=(function(){
  var router=express.Router();

  router.get("/register",function(req,res){
    dbutil.find({},{},"categories",function(err,result){
      if(err){
        res.status(500).send("数据库查询失败").end();
      }else{
        res.render("register.ejs",{categories:result});
      }
    });
  });

  router.use("/register",function(req,res){
    var userName = req.body.userName;
    var userPsw = req.body.passWord;

    dbutil.find({},{},'users',function(err,result){
      if(err){
        res.state(500).send("注册发生错误").end();
      }else{
        dbutil.find({account:userName},{},'users',function(err,result){
          if(err){
            res.state(500).send("注册发生错误").end();
          }else {
            var b = result;
            if(b.length){
              res.send("The useName has been registed!").end();
            }else{
            }
            var target={account:userName,pwd:userPsw};
            dbutil.insert(target,'users',function(err,result){
              if(err) {
                console.log(err);
              }else {
                res.redirect("http://localhost:9900/user/reg-result");
              }
            });
          }
        });
      }
    });
  });

  router.get("/login",function(req,res){
    dbutil.find({},{},"categories",function(err,result){
      if(err){
        res.status(500).send("数据库查询失败").end();
      }else{
        res.render("login.ejs",{categories:result});
      }
    });
  });

  router.use("/login",function(req,res){
    var userName = req.body.userName;
    var userPsw = req.body.passWord;
    dbutil.find({account:userName,pwd:userPsw},{},'users',function(err,result){
      if(err){
        res.state(500).send("登录发生错误").end();
      }else{
        var a = result;
        if(a.length){
          res.redirect("http://localhost:9900/user/log-result");
        }else{
          res.send("Account or password is wrong!").end();
        }
      }
    });

  });

  router.get("/log-result",function(req,res){
    dbutil.find({},{},"categories",function(err,result){
      if(err){
        res.status(500).send("数据库查询失败").end();
      }else{
        res.render("log-result.ejs",{categories:result});
      }
    });
  });

  router.get("/reg-result",function(req,res){
    dbutil.find({},{},"categories",function(err,result){
      if(err){
        res.status(500).send("数据库查询失败").end();
      }else{
        res.render("reg-result.ejs",{categories:result});
      }
    });
  });

  return router;
})();
