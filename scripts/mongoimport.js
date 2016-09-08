module.exports = function (grunt) {

  "use strict";

  grunt.registerMultiTask("mongoimport", "import JSON to mongodb", function () {
    // Force task into async mode and grab a handle to the "done" function.
    var data = this.data,
        done = this.async(),
        apps = require(data.appsFile),
        users = require(data.usersFile),
        reviewsText = require(data.reviewsFile),
        fs = require("fs"),
        Db = require("mongodb").Db,
        Server = require("mongodb").Server,
        client;
    // Run some sync stuff.
    grunt.log.writeln("Processing task...");

    client = new Db("wast", new Server(data.host, data.port), {safe: true});
    client.open(function (err) {
      if(err) {
        grunt.log.writeln("Error openinig database...");
        throw err;
      }
      grunt.log.writeln("Database succesfully opened...");
      client.collection("users", importUsers);
      //client.collection("categories", importCategories);
    });

    function importUsers(err, usersCollection) {
      grunt.log.writeln("Importing users to mongodb...");
      //remove existing documents into the collection
      usersCollection.remove({}, function (err) {
        //insert bulk of randomized apps.
        usersCollection.insert(users, function() {
          if (err) {
            grunt.log.writeln("Error Inserting...");
          }
          client.collection("applications", importApplications);
        });
      });
    }

    function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    function importApp(app, appCollection, done) {
      grunt.log.writeln("Inserting app to mongodb...");
      var downloadRanges = [50, 800, 7000, 22000],
          devices = ["iOS", "Android", "PC"],
          downloads,
          priceRanges,
          ratingRanges,
          rating;

      downloads = Math.floor(Math.random() * downloadRanges[Math.floor(Math.random() * downloadRanges.length)]);

      if(downloads < 800) {
        priceRanges = [4.99, 7.99, 12.99, 49.99];
        ratingRanges = [1, 2, 3, 4];
      } else if (downloads < 7000) {
        priceRanges = [0, 0.99, 1.99, 3.99, 4.99];
        ratingRanges = [3, 4];
      } else if (downloads < 22000){
        priceRanges = [0, 0.99, 1.99];
        ratingRanges = [4, 5];
      }

      client.collection("users", function (err, usersCollection) {
        usersCollection.find().toArray(function (err, users) {

          app.releaseDate = randomDate(new Date(2012, 0, 1), new Date());

          var nroReviews = Math.floor(Math.random() * 10),
              reviews = [],
              review;

          for (var i = 0; i < nroReviews; i+=1) {
            rating  = ratingRanges[Math.floor(Math.random() * ratingRanges.length)];

            review = {
              comment: reviewsText[rating][Math.floor(Math.random() * reviewsText[rating].length)],
              rating: rating,
              "user_id": users[Math.floor(Math.random() * users.length)]["_id"],
              date: randomDate(app.releaseDate, new Date())
            };

            reviews.push(review);

            //removed user that has reviewed and app.
            users = users.filter(function (u) {
              return u["_id"] !== review["user_id"];
            });

          }

          app.device = devices[Math.floor(Math.random() * devices.length)];
          app.downloads = downloads;
          app.avgRating = (function () {
            var sum = 0;

            reviews.forEach(function (r) {
              sum += r.rating;
            });

            return reviews.length === 0 ? 0 : sum/reviews.length;

          }());

          app.price = priceRanges[Math.floor(Math.random() * priceRanges.length)];
          app.reviews = reviews.length;
          app.promoted = Math.random() < 0.07;
          //0 - 50MB
          app.size = Math.random() * 50;
          app.status = "listed";

          //insert app to collection and the insert reviews
          appCollection.insert(app, function() {
              //set application_id to the previously added reviews and
              //insert them into mongodb
              reviews.forEach(function (r) {
                r["application_id"] = app["_id"];
              });
              if (reviews.length > 0) {
                client.collection("reviews", function (err, reviewsCollection) {
                  reviewsCollection.insert(reviews, function (err) {
                    if (err) {
                      throw err;
                    }
                    grunt.log.writeln("Inserting reviews to mongodb...");
                    done();
                  });
                });
              } else {
                done();
              }
            });
        });
      });

    }

    function importApplications(err, appCollection) {
      //remove existing documents into the collection
      var imported = 0;
      appCollection.remove({}, function () {
        grunt.log.writeln("Droped applications...");
        client.collection("reviews", function (err, reviewsCollection) {
          reviewsCollection.remove({}, function () {
            grunt.log.writeln("Droped reviews...");
            apps.forEach(function (app) {
              importApp(app, appCollection, function () {
                imported += 1;
                if (imported === apps.length) {
                  fs.writeFileSync(data.backupAppsFile, JSON.stringify(apps, null, 4));
                  done();
                  client.close();
                }
              });
            });
          });
        });
      });
    }
  });

};

