define([
  "app",
  "models/model"
],
function (app, Model) {
  "use strict";

  var Review = Model.extend({

    urlRoot: "/reviews",

    idAttribute: "_id",

    parse: function (res) {
      var rating = Math.floor(res.rating),
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

      res.date = new Date(res.date).toLocaleString();

      return res;
    },

    validate: function (attrs) {
      var errors = [];
      if (attrs.comment === "") {
        errors.push("Complete the comment field");
      }
      if (!(attrs.rating > 0 && attrs.rating <= 5)) {
        errors.push("Select a star for your review!");
      }
      return errors.length > 0 ? errors : null;
    }

  });

  return Review;

});
