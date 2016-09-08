var Db = require("mongodb").Db,
    Server = require("mongodb").Server;

var Provider = function (collectionName) {
  "use strict";

  var dbName = process.env.MONGODB_DB_NAME;
  var dbHost = process.env.MONGODB_HOST;
  var dbPort = process.env.MONGODB_PORT;

  this.db = new Db(dbName, new Server(dbHost, dbPort), {safe: true});
  this.db.open(function() {
    console.log('Connected to mongodb!');
  });
  this.collectionName = collectionName;
};


Provider.prototype.getCollection = function(callback) {
  "use strict";
  this.db.collection(this.collectionName, function(error, collection) {
    if(error) {
      callback(error);
    } else {
      callback(null, collection);
    }
  });
};

exports.Provider = Provider;
