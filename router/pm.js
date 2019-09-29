var express = require("express");
var setting = require("../libs/setting");
var mongoUtil = require("../libs/mongoUtil");
var dbutil = new mongoUtil(setting.host,setting.port,setting.dbname);
var fs = require("fs")//文件系统
var path = require("path");// 文件路径
var multer = require("multer");

module.exports = (function(){
  var router = express.Router();


  router.use("/list",function(req,res){
    dbutil.find({},{},"products",function(err,result){
      if(err){
        res.status(500).send("数据库查询错误").end();
      }else{
        res.render("product_list.ejs",{product:result});
      }
    });
  });

  //显示增加的页面
  router.get("/add",function(req,res){
    res.render("product_add.ejs",{product:""});
  });
  router.post("/add",function(req,res){
    //获取表单的数据
    var pro = req.body;
    if(!req.files[0] === false){
      var extName = path.extname(req.files[0].originalname);
      var newName = req.files[0].path + extName;
      fs.rename(req.files[0].path,newName,function(err,data){
        if(err)  throw err;
      });
    }
    pro.photo = newName || "";
    dbutil.find({},{sort:{pid:-1},limit:1},"products",function(err,result){
      if(err){
        res.status(500).send("数据库查询错误").end();
      }else{
        pro.pid = result[0].pid +1;
        pro.parentId = parseInt(pro.parentId);
        dbutil.insert(pro,"products",function(err,result){
          if(err){
            res.status(500).send("数据库新增错误").end();
          }else{
            console.log(req.body);
            res.redirect("http://localhost:9900/product/list");
          }
        });
      }
    });
  });


  router.get("/update",function(req,res){
    var pid = parseInt(req.query.pid);
    dbutil.find({pid:pid},{},"products",function(err,data){
      if(err){
        res.status(500).send("数据库查询错误").end();
      }else {
        res.render('product_update.ejs', {product: data[0]});
      }
    });
  });
  //如果没有修改数据的话内容不变
  router.post("/update",function(req,res){
    var pro = req.body;
    if(!req.files[0] === false){
      var extName = path.extname(req.files[0].originalname);
      var newName = req.files[0].path + extName;
      fs.rename(req.files[0].path,newName,function(err,data){
        if(err)  throw err;
      });
    }
    pro.photo = newName || "";
    dbutil.update({pid:pro.pid},
      {$set:{pid:pro.pid,pic:pro.photo,pname:pro.pname,parentId:pro.parentId,price:pro.price,brand:pro.brand,quantity:pro.quantity,code:pro.code
      }},"products",function(err,data){
      res.redirect("http://localhost:9900/product/list");
    })
  });

  router.use("/delete",function(req,res){
    var pid = parseInt(req.query.pid);
    dbutil.delete({pid:pid},"products",function(err,result){
      if(err){
        res.status(500).send("删除数据除错").end();
      }else{
        res.redirect("http://localhost:9900/product/list");
      }
    });
  });

  return router;
})();