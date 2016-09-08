define([
  "views/carousel",
  "views/screenshot"
],
function (Carousel, Screenshot) {
  "use strict";

  var Screenshots = Carousel.extend({

    className: "carousel slide two",
    //this id is added to allow twitter bootstrap carousel manage prev/next
    id: "screenshots-carousel",

    initialize: function () {
      Carousel.prototype.initialize.call(this, this.options);
      //set promoted apps collection.

      var screenshotsModels = this.options.screenshots.map(function (s) {
        return new Backbone.Model({
          image: s
        });
      });

      this.collection = new Backbone.Collection(screenshotsModels);

      var self = this;
      this.collection.each(function (s) {
        self.add(s);
      });

    },

    add: function (item) {
      this.insertView(".carousel-inner", new Screenshot({
        model: item
      })).render();
    },

    afterRender: function () {
      this.start();
    }

  });

  return Screenshots;

});
