define([
  "app"
],
function () {
  "use strict";

  var Review = Backbone.View.extend({

    tagName: "article",

    className: "review one hidden",

    template: "review",

    serialize: function () {
      return this.model.toJSON();
    },

    afterRender: function () {
      //CSS3 Transition doesn't work for dynamically injected elements
      //http://stackoverflow.com/questions/11784912/adding-element-to-dom-and-applying-class-with-jquery-doesnt-apply-css3-transiti
      setTimeout($.proxy(function () {
        this.$el.removeClass("hidden");
      }, this), 0);
    }


  });

  return Review;

});
