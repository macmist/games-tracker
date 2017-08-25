var express = require('express');
module.exports.http = {
  customMiddleware: function (app) {
    app.use('/node_modules', express.static(process.cwd() + '/node_modules'));
    app.use('/app', express.static(process.cwd() + "/assets/app"));
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }
};
