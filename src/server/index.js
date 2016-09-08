var express = require("express"),
    http = require("http"),
    cors = require("cors"),
    Provider = require("./provider").Provider,
    objectID = require("mongodb").ObjectID,
    fs = require("fs"),
    path = require("path"),
    jwt = require("jsonwebtoken"),
    socketioJwt = require("socketio-jwt"),
    config = require('./config');


//Create express app
var app = express();

// disable unnecessary express features
app.disable("x-powered-by");

//set port
app.set("port", process.env.PORT);

/** MIDDLEWARES **/

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(cors());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.logger("dev"));
app.use(express.errorHandler({
  dumpException: true,
  showStack: true
}));

var server = http.createServer(app),
    sio = require("socket.io").listen(server);

server.listen(app.get("port"), function () {
  "use strict";
  console.log("%s listening on port %d", "wast", app.get("port"));
});

sio.use(socketioJwt.authorize({
  secret: config.secret,
  handshake: true
}));

sio.sockets.on("connection", function (socket) {
  "use strict";
  console.log(socket.decoded_token.name, "connected");
});

var applicationProvider = new Provider("applications");
var reviewsProvider = new Provider("reviews");
var usersProvider = new Provider("users");

// authentication
function restrict(req, res, next) {
  "use strict";
  // check if there is a valid token here.
  if (req.session.user) {
    next();
  } else {
    res.json(401, "Unauthorized");
  }
}

function authenticate(user, password, cb) {
  "use strict";
  usersProvider.getCollection(function (err, collection) {
    collection.findOne({
      $or: [{
        username: user
      }, {
        email: user
      }],
      password: password
    }, {
      username: 1,
      email: 1,
      avatar: 1
    }, function(err, user) {
      if (user) {
        cb(null, user);
      } else {
        cb(new Error("Unauthorized!"));
      }
    });
  });
}

//RESTful APIs

//GET - By id
app.get("/applications/:id", function(req, res) {
  "use strict";
  applicationProvider.getCollection(function (err, collection) {
    collection.findOne({
      _id: objectID(req.param("id"))
    }, function(error, doc){
      res.json(doc);
    });
  });
});

//GET - List
app.get("/applications", function(req, res) {
  "use strict";
  applicationProvider.getCollection(function (err, collection) {
    collection.find().toArray(function(error, docs){
      res.json(docs);
    });
  });
});

//PUT - Update
app.put("/applications/:id", function(req, res) {
  "use strict";
  applicationProvider.getCollection(function (err, collection) {
    collection.findAndModify({
      _id: objectID(req.param("id"))
    }, [
      ["_id","asc"]
    ], {
      $set: {
        downloads: req.param("downloads"),
        status: req.param("status")
      }
    }, {
      //option to return the recent modified object
      new: true
    }, function (error, doc){
      res.json(doc);
    });
  });
});

// Non CRUD operations for apps.
// Download
app.post("/applications/:id/download", restrict, function(req, res) {
  "use strict";
  applicationProvider.getCollection(function (err, collection) {
    collection.findOne({
      _id: objectID(req.param("id"))
    }, function(error, doc){
      res.json(doc);
      //start download process by socket.io
      clients[req.session.id].download(doc);
    });
  });
});

// Pause
app.post("/applications/:id/pause", restrict, function(req, res) {
  "use strict";
  applicationProvider.getCollection(function (err, collection) {
    collection.findOne({
      _id: objectID(req.param("id"))
    }, function(error, doc){
      res.json(doc);
      clients[req.session.id].pause(doc);
    });
  });
});

// Resume
app.post("/applications/:id/resume", restrict, function(req, res) {
  "use strict";
  applicationProvider.getCollection(function (err, collection) {
    collection.findOne({
      _id: objectID(req.param("id"))
    }, function(error, doc){
      res.json(doc);
      clients[req.session.id].resume(doc);
    });
  });
});

// Cancel
app.post("/applications/:id/cancel", restrict, function(req, res) {
  "use strict";
  applicationProvider.getCollection(function (err, collection) {
    collection.findOne({
      _id: objectID(req.param("id"))
    }, function(error, doc){
      res.json(doc);
      clients[req.session.id].cancel(doc);
    });
  });
});

//Users
app.post("/users", function (req, res) {
  "use strict";
  usersProvider.getCollection(function (err, collection) {

    collection.insert({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }, function(err, docs) {
      var user = docs[0],
          imgBase64,
          imagePath;
      if (req.body.avatar) {
        imgBase64 = req.body.avatar.replace(/^data:image\/jpeg;base64,/,"");
        imagePath = path.resolve(__dirname, "../webroot/images/users/") + user["_id"] + ".jpg";


        fs.writeFile(imagePath, imgBase64, "base64", function (err) {
          var imgUrl = "/images/users/" + user["_id"] + ".jpg";
          if (err) {
            throw err;
          }
          collection.update({
            _id: user["_id"]
          }, {
            $set: {
              avatar: imgUrl
            }
          }, {
            safe:true
          }, function (err) {
            if (err) {
              console.warn(err.message);
            } else {
              user.avatar = imgUrl;
              console.log("successfully updated");
              delete user.password;
              res.json(user);
            }
          });
        });
      } else {
        delete user.password;
        res.json(user);
      }

    });
  });
});

//Update user
app.put("/users/:id", restrict, function (req, res) {
  "use strict";
  usersProvider.getCollection(function (err, collection) {

    function updateUser(userFields) {
      collection.findAndModify({
        _id: objectID(req.param("id"))
      }, [
        ["_id","asc"]
      ], {
        $set: userFields
      }, {
        //option to return the recent modified object
        new: true
      }, function (error, doc){
        res.json(doc);
      });
    }

    var imgBase64,
        imagePath,
        avatar = req.body.avatar,
        regexBase64 = /^data:image\/jpeg;base64,/;

    //the image is comming in base64 otherwise don't need to update it
    if (avatar && regexBase64.test(avatar)) {
      imgBase64 = avatar.replace(regexBase64, "");
      imagePath = path.resolve(__dirname, "../webroot/images/users/") + req.param("id") + ".jpg";
      fs.writeFile(imagePath, imgBase64, "base64", function (err) {
        var userFields = {
          billingAddress: req.param("billingAddress"),
          tel: req.param("tel")
        };
        if (!err) {
          userFields.avatar = "/images/users/" + req.param("id") + ".jpg";
        }
        updateUser(userFields);
      });
    } else {
      updateUser({
        billingAddress: req.param("billingAddress"),
        tel: req.param("tel")
      });
    }

  });

});

//GET user
app.get("/users/:id", restrict, function(req, res) {
  "use strict";
  usersProvider.getCollection(function (err, collection) {
    collection.findOne({
      _id: objectID(req.param("id"))
    }, function(error, doc){
      res.json(doc);
    });
  });
});

app.get("/categories", function(req, res) {
  "use strict";
  applicationProvider.getCollection(function (err, collection) {
    collection.distinct("category", function(error, docs){
      res.json(docs.sort());
    });
  });
});

//Reviews
app.get("/reviews", function(req, res) {
  "use strict";
  reviewsProvider.getCollection(function (err, collection) {
    collection.find().toArray(function(error, docs){
      res.json(docs);
    });
  });
});

app.get("/reviews/graph/:id", function(req, res) {
  "use strict";
  reviewsProvider.getCollection(function (err, reviewCollection) {

    reviewCollection.find({
      "application_id": objectID(req.param("id"))
    }, {rating: 1}).toArray(function(error, docs){

      var five = {
        stars: 5,
        count: 0,
        percentage: 0
      },
      four = {
        stars: 4,
        count: 0,
        percentage: 0
      },
      three = {
        stars: 3,
        count: 0,
        percentage: 0
      },
      two = {
        stars: 2,
        count: 0,
        percentage: 0
      },
      one = {
        stars: 1,
        count: 0,
        percentage: 0
      },
      total = docs.length;

      docs.forEach(function (review) {
        switch(review.rating) {
        case 5:
          five.count +=1;
          five.percentage = five.count/total * 100;
          break;
        case 4:
          four.count +=1;
          four.percentage = four.count/total * 100;
          break;
        case 3:
          three.count +=1;
          three.percentage = three.count/total * 100;
          break;
        case 2:
          two.count +=1;
          two.percentage = two.count/total * 100;
          break;
        case 1:
          one.count +=1;
          one.percentage = one.count/total * 100;
          break;
        }
      });
      applicationProvider.getCollection(function (err, collection) {
        collection.findOne({
          _id: objectID(req.param("id"))
        }, function(error, doc){
          res.json({
            avgRating: doc.avgRating,
            reviews: doc.reviews,
            bars: [five, four, three, two, one]
          });
        });
      });
    });

  });

});

app.get("/reviews/:id", function(req, res) {
  "use strict";
  reviewsProvider.getCollection(function (err, reviewCollection) {

    reviewCollection.find({
      "application_id": objectID(req.param("id"))
    }).sort({date: -1}).toArray(function(error, docs){
      function done() {
        res.json(docs);
      }

      if (docs.length > 0) {
        var count = 0;
        usersProvider.getCollection(function (err, usersCollection) {
          docs.forEach(function (review) {
            usersCollection.findOne({"_id": review["user_id"]}, {avatar:1, username:1}, function (err, user) {
              review.avatar = user.avatar;
              review.author = user.username;
              count += 1;
              if (count === docs.length) {
                done();
              }
            });
          });
        });
      } else {
        done();
      }

    });

  });

});

//Users
app.post("/reviews", restrict, function (req, res) {
  "use strict";
  reviewsProvider.getCollection(function (err, collection) {
    collection.insert({
      "user_id": objectID(req.session.user["_id"]),
      "application_id": objectID(req.body["application_id"]),
      rating: +req.body.rating,
      comment: req.body.comment,
      date: new Date()
    }, function(err, docs) {
      var review = docs[0];
      res.json(review);
      applicationProvider.getCollection(function (err, collection) {
        collection.findOne({
          _id: objectID(req.body["application_id"])
        }, function(error, app){
          app.avgRating = (app.avgRating * app.reviews + (+req.body.rating)) / (app.reviews + 1);
          app.reviews += 1;
          collection.update({
            _id: objectID(req.body["application_id"])
          }, {
            $set: {
              avgRating: app.avgRating,
              reviews: app.reviews
            }
          }, {
            safe:true
          }, function (err) {
            if (err) {
              console.warn(err.message);
            }
            //send update by socket!
            clients[req.session.id].review(app);
          });

        });
      });
    });
  });
});

app.get("/related/:id/:count", function(req, res) {
  "use strict";
  applicationProvider.getCollection(function (err, collection) {
    collection.findOne({
      _id: objectID(req.param("id"))
    }, function(error, app){
      collection.find({
        category: app.category,
        _id: {$ne: objectID(req.param("id"))}
      }).limit(+req.param("count")).toArray(function(error, docs){
        res.json(docs);
      });
    });
  });
});

/* Session */
app.post("/session", function(req, res) {
  "use strict";
  authenticate(req.body.username, req.body.password, function (err, user) {
    if (user) {

      var token = jwt.sign({
        userid: user["_id"],
        username: user.username
      }, config.secret, { expiresInMinutes: config.sessionTime });

      res.json({
        authenticated: true,
        token: token,
        username: user.username,
        useravatar: user.avatar,
        userid: user["_id"]
      });
    } else {
      res.json(500, {errors: ["Invalid user name or password."]});
    }
  });
});

app.del("/session", function (req, res) {
  "use strict";
  // logout
  res.json({
    authenticated: false
  });
});
