define([
  "app",
  "views/wast"
],
function (app, WastView) {
  "use strict";

  var Carousel = WastView.extend({

    template: "carousel",

    className: "carousel slide one",

    initialize: function () {
      WastView.prototype.initialize.call(this, this.options);
      this.$el.carousel({
        interval: false
      });
      this.$el.hammer({
        "swipe_max_touches": 0,
        "swipe_velocity": 0
      });
    },

    start: function () {
      this.$(".item:first-child").addClass("active");
      this.$("#shadow-container").addClass("shadow");
      if (this.collection.size() > 1) {
        this.$(".carousel-control").removeClass("hidden");
      }
    },

    serialize: function () {
      return {
        id: this.id
      };
    },

    events: {
      "swipeleft": "next",
      "swiperight": "prev"
    },

    next: function () {
      this.$el.carousel("next");
    },

    prev: function () {
      this.$el.carousel("prev");

    }

  });

  return Carousel;

});
