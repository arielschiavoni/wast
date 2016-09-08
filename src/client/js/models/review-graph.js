define([
  "app",
  "models/model"
],
function (app, Model) {
  "use strict";

  var ReviewGraph = Model.extend({

    defaults: {
      bars: []
    },

    initialize: function (options) {
      this.url = "/reviews/graph/" + options.applicationId;
    },

    parse: function (res) {
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
      return res;
    }

  });

  return ReviewGraph;

});
