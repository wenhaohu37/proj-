var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// var mongoUtil = require("../libs/mongoUtil");
// var setting = require("../libs/setting");
// var dbutil = new mongoUtil(setting.host,setting.port,setting.dbname);
// var ObjectID = require("mongodb").ObjectID;
mongoose.connect('mongodb://localhost:27017/easybuy',{useNewUrlParser:true},(err)=>{
  if(err){
    throw err;
  }else{
    console.log('success to connect');
  }
})
var orderSchema = new mongoose.Schema({
  uid:Number,
  addr:String,
  oid:String,
  name:String,
  otime:String,
  ostatus:String
});
var orderModel = mongoose.model('order',orderSchema,'order');
var orders = new Array();
for(var i = 0;i<20;i++){
  let rorder = new orderModel({
    uid:i,
    name:"A"+i,
    oid:"Bc52"+i,
    ostatus:"正在派送中...",
    addr:"虹桥机场"+i,
    otime:new Date().toLocaleDateString()
  })
  orders.push(rorder);
}
orderModel.insertMany(orders,(err)=>{
  if(err)throw err;

})

router.get('/list',(req,res)=>{
  orderModel.find({}).exec((err,data)=>{
    if(err) throw err;
    else{
      var allArr = data;
      if(req.query.page=='0' || !req.query.page){
        var needPage = 0;
      }else{
        var needPage = req.query.page;
      }
      var maxL = Math.ceil(allArr.length/5);
      var needArr = !req.query.page?allArr.slice(0,5):allArr.slice(req.query.page*5,req.query.page*5+5);
      res.render('order_list.ejs',{orderData:needArr,page:needPage,maxL:maxL});

    }
  });
});

router.get('/order-modify.html',(req,res)=>{
  var id = req.query.id;
  orderModel.findById(id).exec((err,data)=>{
    if(err) throw err;
    res.render("order_update.ejs",{'order':data});
  })
});
router.post("/manage-result.html",(req,res)=>{
  var oid = req.body.oid;
  var name = req.body.name;
  var id = req.body.id;
  var otime = req.body.otime;
  orderModel.findById(id).exec((err,data)=>{
    if(err){
      throw err;
    }else if(data){
      data.oid = oid;
      data.name = name;
      data.otime = otime;
      data.save((err)=>{
        if(err){
          throw err;
        }else{
          res.send("<script>alert('修改成功');location.href='http://localhost:9900/order/list'</script>")

        }
      })
    }

  })
})
router.get('/user-delete.html',(req,res)=>{
  var id = req.query.id;
  orderModel.findById(id).exec((err,data)=>{
    if(data){
      data.remove((err)=>{
        if(err) throw err;
        res.send("<script>alert('删除成功');location.href='http://localhost:9900/order/list'</script>")
      })
    }
  })
})
router.post('/search.html',(req,res)=>{
  var b= req.body
  console.log(b)
  orderModel.find(b).exec((err,data)=>{
    if(err){
      throw err;
    }else{
      res.render("search.ejs",{order:b});
    }
  })
})

// router.use("/search.html",function (req,res) {
//   dbutil.find({oid:req.body.oid},{},"order",function (err,data) {
//     if(err){
//       res.status(404).send("数据库访问失败").end();
//     }else{
//       console.log(data)
//       res.render("search.ejs",{order:data});
//     }
//   });
// });
orderModel.deleteMany({}).exec((err)=>{
  if(err) throw err;
})
module.exports=router;