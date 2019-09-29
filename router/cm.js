var express = require("express");
var setting = require("../libs/setting");
var mongoUtil = require("../libs/mongoUtil");
var dbutil = new mongoUtil(setting.host,setting.port,setting.dbname);

module.exports = (function(){
  var router = express.Router();

  //根据id查询需要修改的类别
  router.get("/add",function(req,res,next){
    if(req.query.cid){
      dbutil.find({cid:parseInt(req.query.cid)},{},"categories",function(err,result){
        if(err){
          res.status(404).send("数据库访问失败").end();
        }else{
          req.category = result[0];
          next();
        }
      });
    }else{
      next();
    }
  });
  // 查询所有的父类别
  router.get("/add",function(req,res,next){
    dbutil.find({parentId:0},{},"categories",function(err,result){
      if(err){
        res.status(404).send("数据库访问失败").end();
      }else{
        req.categories = result;
        next();
      }
    });
  });

  //新增：get得到新增表单，同时查询“大类”
  router.get("/add",function(req,res){
    // 合并数据到模板文件中，输出html
    res.render("cate_add.ejs",{categories:req.categories,category:req.category || {}});
  });
  // post 提交数据，处理新类别数据
  router.post("/add",function(req,res){
    var cate = req.body;
    if(cate.cname.trim().length===0){
      res.render("cate_add.ejs",{categories:req.categories,category:cate});
    }else{
      //新类别的cid = max(已有cid)+1
      dbutil.find({},{sort:{cid:-1},limit:1},"categories",function(err,result){
        if(err){
          res.status(500).send("数据库查询失败").end();
        }else{
          cate.cid = result[0].cid +1;
          cate.parentId = parseInt(cate.parentId);
          dbutil.insert(cate,"categories",function(err,result){
            if(err){
              res.status(500).send("数据库新增失败").end();
            }else{
              res.redirect("http://localhost:9900/manage-result.html");
            }
          });
        }
      });
    }
  });

  router.use("/list",function(req,res){
    dbutil.find({},{sort:{cid:1}},"categories",function(err,result){
      if(err){
        res.status(500).send("数据库查询失败").end();
      }else{
        res.render("cate_list.ejs",{categories:result});
      }
    });
  });

  router.use("/delete",function(req,res,next){
    var cid = parseInt(req.query.cid);
    //如果删除的是大类，并且其下有小类
    //不能删除
    dbutil.find({parentId:cid},{},"categories",function(err,result){
      if(err){
        res.status(500).send("数据库查询失败").end();
      }else{
        req.pcs = result;
        next();
      }
    });
  });

  router.use("/delete",function(req,res,next){
    var cid = parseInt(req.query.cid);
    // 类别下存在商品，
    //不能删除
    dbutil.find({category:cid},{},"products",function(err,result){
      if(err){
        res.status(500).send("数据库查询失败").end();
      }else{
        req.ps = result;
        next();
      }
    });
  });
  router.use("/delete",function(req,res){
    var cid = parseInt(req.query.cid);

    if(req.pcs.length<=0 && req.ps.length<=0){
      dbutil.delete({cid:cid},"categories",function(err,result){
        if(err){
          res.status(500).send("删除数据失败").end();
        }else{
          res.redirect("http://localhost:9900/category/list");
        }
      });
    }else{
      res.status(200).send("类别是大类别并且其下存在小类别，或者类别存在商品，不能删除").end();
    }
  });
  return router;
})();