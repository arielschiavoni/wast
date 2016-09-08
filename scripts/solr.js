module.exports = function (grunt) {
  "use strict";

  grunt.registerMultiTask("solr", "My solr task.", function () {
    // Force task into async mode and grab a handle to the "done" function.
    //
    var data = this.data;
    var done = this.async();
    // Run some sync stuff.
    grunt.log.writeln("Processing task...");

    //
    var http = require("http"),
        Db = require("mongodb").Db,
        Server = require("mongodb").Server,
        client,
        appsJSON;

    function deleteSolrApps(done) {
      var options = {
            host: data.solr.host,
            port: data.solr.port,
            path: "/solr/update?stream.body=%3Cdelete%3E%3Cquery%3E*:*%3C/query%3E%3C/delete%3E",
            method: "GET"
          },
          reqDelete,
          reqCommit;

          //http://localhost:8983/solr/update?stream.body=%3Cdelete%3E%3Cquery%3E*:*%3C/query%3E%3C/delete%3E
          //http://localhost:8983/solr/update?stream.body=%3Ccommit/%3E

      reqDelete = http.request(options, function () {
        grunt.log.writeln("delete...");
        options.path = "/solr/update?stream.body=%3Ccommit/%3E";
        reqCommit = http.request(options, function () {
          grunt.log.writeln("commit...");
          done();
        });
        reqCommit.on("error", function (e) {
          grunt.warn(e.message);
        });
        reqCommit.end();

      });

      reqDelete.on("error", function (e) {
        grunt.warn(e.message);
      });

      reqDelete.end();

    }

    function exportToSolr() {
      grunt.log.writeln("Loading apps to solr...");

      var options = {
            host: data.solr.host,
            port: data.solr.port,
            path: "/solr/update/json?commit=true",
            method: "POST",
            headers: {
             "Content-Type": "application/json"
            }
          },

          req = http.request(options, function (res) {
            res.setEncoding("utf8");
            res.on("data", function (chunk) {
              grunt.log.writeln("...");
            });
            res.on("end", function () {
              done();
              grunt.log.writeln("All done!");
            });
          });

      req.on("error", function (e) {
        grunt.warn(e.message);
      });

      // post the data
      req.write(appsJSON);
      req.end();
    }


    client = new Db("wast", new Server(data.mongo.host, data.mongo.port), {safe: true});
    client.open(function (err) {
      if(err) {
        grunt.log.writeln("Error openinig database...");
        throw err;
      }
      grunt.log.writeln("Database succesfully opened...");
      client.collection("applications", function (err, collection) {
        if(err) {
          grunt.log.writeln("Error retreaving collection...");
          throw err;
        }
        collection.find().toArray(function(error, results) {
          if(error) {
            grunt.log.writeln("Error finding apps into collection...");
            throw error;
          } else {
            appsJSON = JSON.stringify(results);
            deleteSolrApps(exportToSolr);
          }
        });
      });
    });
  });

};
