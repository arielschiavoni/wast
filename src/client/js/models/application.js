define([
  "app",
  "models/model"
],
function (app, Model) {
  "use strict";

  var Application = Model.extend({

    urlRoot: "/applications",

    idAttribute: "_id",

    parse: function (res) {
      var currencies = {
        "USD": "$"
      };

      if (res.price === 0) {
        res.free = true;
      } else {
        if (res["price_c"]) {
          res.price = currencies[res["price_c"].split(",")[1]] + res.price.toFixed(2);
        } else {
          res.price = currencies["USD"] + res.price.toFixed(2);
        }

      }

      var rating = res.avgRating,
        stars = [];

      for (var i = 1; i <= 5; i += 1) {
        if (rating >= i) {
          stars.push("icon-star");
        } else {
          if ((rating - (i - 1)) >= 0.5 ) {
            stars.push("icon-star-half");
          }
        }
      }

      res.stars = stars;
      res.avgRating = res.avgRating.toFixed(1);

      res.size = res.size.toFixed(2);

      return res;
    },

    download: function (options) {
      this.nonCRUDOperation("download", _.extend({
        method: "POST"
      }, options));
    },

    pause: function (options) {
      this.nonCRUDOperation("pause", _.extend({
        method: "POST"
      }, options));
    },

    resume: function (options) {
      this.nonCRUDOperation("resume", _.extend({
        method: "POST"
      }, options));
    },

    cancel: function (options) {
      this.nonCRUDOperation("cancel", _.extend({
        method: "POST"
      }, options));
    }

  });

  return Application;

});
