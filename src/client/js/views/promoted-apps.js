define([
  "views/carousel",
  "collections/application",
  "views/application-promoted"
],
function (Carousel, AppCollection, ApplicationPromoted) {
  "use strict";

  var PromotedApps = Carousel.extend({

    id: "promoted-apps-carousel",

    initialize: function () {
      Carousel.prototype.initialize.call(this, this.options);
      //set promoted apps collection.
      this.collection = new AppCollection([], {
        promoted: true,
        rows: 5
      });

      var self = this;
      this.listenTo(this.collection, "sync", function (appCollection) {
        appCollection.each(function (app) {
          self.add(app);
        });
        //start carousel
        self.start();
      });

      this.loading(this.collection);
      this.collection.fetch();
    },

    add: function (item) {
      this.insertView(".carousel-inner", new ApplicationPromoted({
        model: item
      })).render();
    }

  });

  return PromotedApps;

});
