var express = require("express");
var setting = require("../libs/setting");
var mongoUtil = require("../libs/mongoUtil");
var dbutil = new mongoUtil(setting.host,setting.port,setting.dbname);

module.exports = (function(){
  var router = express.Router();
  router.use("/",function (req,res) {
    dbutil.find({}, {}, "news", function (err, data) {
      if (err) {
        throw err;
      } else {
        res.render("news_view.ejs", {news: data});
      }
    });
  });
  return router;
})();