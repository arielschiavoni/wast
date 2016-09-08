define([
  "app",
  "collections/review",
  "views/review",
  "views/wast"
],
function (app, ReviewCollection, Review, WastView) {
  "use strict";

  var Reviews = WastView.extend({

    initialize: function () {
      WastView.prototype.initialize.call(this, this.options);
      this.collection = new ReviewCollection([], {
        applicationId: this.options.applicationId
      });

      var self = this;

      app.io.on("application update " + this.options.applicationId, function () {
        self.collection.fetch({
          reset: true
        });
        self.render();
      });

      this.collection.on("sync", function (reviewCollection) {
        reviewCollection.each(function (review) {
          self.add(review);
        });
      });

      this.loading(this.collection);
      this.collection.fetch({
        reset: true
      });

    },

    stopListening: function () {
      //call to parent remove
      WastView.prototype.stopListening.call(this);
      app.io.removeAllListeners("application update " + this.options.applicationId);
    },

    add: function (item) {
      this.insertView(new Review({
        model: item
      })).render();
    }

  });

  return Reviews;

});
