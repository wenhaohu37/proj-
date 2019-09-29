//引入mongodb中间件
var dbc = require("mongodb").MongoClient;


//封装了类：对mongodb的集合进行增删改查
//定义类的构造函数，定义属性
//host:主机名
//port:端口号
//dbname:数据库名
function MongoUtil(host,port,dbname){
  this.host = host;
  this.port = port;
  this.dbname = dbname;
}
//在构造函数的原型对象上定义方法：连接数据库connectDb
// insert插入  update 修改   delete删除   find查询
//fn:回调函数，连接成功后调用该回调函数fn
MongoUtil.prototype.connectDb = function(fn){
  var url = "mongodb://"+this.host+":"+this.port+"/"+this.dbname;
  dbc.connect(url,{useNewUrlParser:true},function(err,client){
    if(err) throw err;
    //连接成功，执行回调函数
    fn(client);
  });
}

// json:查找要删除的数据的条件
// collectionName:集合名
// fn:回调函数，指定删除数据后的处理
MongoUtil.prototype.delete = function(json,collectionName,fn){
  this.connectDb(function(client){
    var db = client.db(this.dbname);
    var coll = db.collection(collectionName);
    coll.deleteMany(json,function(err,result){
      //删除数据后，交给回调函数处理删除后的需要执行的功能
      fn(err,result);
      client.close();
    });
  });
}

//json:需要新增的数据，1个对象，1个集合(包含多个对象)
MongoUtil.prototype.insert = function(json,collectionName,fn){
  this.connectDb(function(client){
    var db = client.db(this.dbname);
    var coll = db.collection(collectionName);

    //准备新增，按照json分为：1个对象 insertOne，insertMany
    if(json.constructor === Array){
      coll.insertMany(json,function(err,result){
        fn(err,result);
      });
    }
    else{
      coll.insertOne(json,function(err,result){
        fn(err,result);
      });
    }
    client.close();
  });
}

// consition 查找数据的条件
// val 怎样修改数据
// collectionName 集合名， fn 回调函数
MongoUtil.prototype.update = function(condition,val,collectionName,fn){
  this.connectDb(function(client){
    var db = client.db(this.dbname);
    var coll = db.collection(collectionName);
    coll.updateMany(condition,val,function(err,result){
      //修改数据后，交给回调函数处理修改后的需要执行的功能
      fn(err,result);
      client.close();
    });
  });
}

//condition:查找数据的条件
// args:排序等数据：sort：排序，props:要查找的属性列表
//      skip:跳过的数量， limit：显示的数量
MongoUtil.prototype.find = function(condition,args,collectionName,fn){
  this.connectDb(function(client){
    var db = client.db(this.dbname);
    var coll = db.collection(collectionName);

    var props = args.props || {};//需要提取的属性列表
    var sort = args.sort || {}; //排序依据
    var skipNum = args.skip || 0; //跳过的数量
    var limitNum = args.limit || 0; //限制的数量

    coll.find(condition,props).sort(sort).skip(skipNum)
      .limit(limitNum).toArray(function(err,result){
      fn(err,result);
      client.close();
    });

  });
}

// MongoUtil.prototype.findMoreCol = function(condition,args,collectionName,fn){
//   this.connectDb(function(client){
//     var db = client.db(this.dbname);
//     var colList = []
//     var resultList = []
//
//     for(var i = 0;i <collectionName.length;i ++) {
//       var props = args[i].props || {};//需要提取的属性列表
//       var sort = args[i].sort || {}; //排序依据
//       var skipNum = args[i].skip || 0; //跳过的数量
//       var limitNum = args[i].limit || 0; //限制的数量
//
//       colList.push(db.collection(collectionName[i]))
//       colList[i].find(condition[i],props).sort(sort).skip(skipNum)
//         .limit(limitNum).toArray(function(err,result){
//           resultList.push(result)
//         fn(err,resultList);
//         client.close();
//       });
//     }
//     // var coll = db.collection(collectionName);
//   });
// }

//中间件导出类
module.exports = MongoUtil;

