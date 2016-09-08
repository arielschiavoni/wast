define([
  "app"
],
function () {
  "use strict";

  var Screenshot = Backbone.View.extend({

    tagName: "div",

    className: "item",

    template: "screenshot",

    serialize: function () {
      return this.model.toJSON();
    },

  });

  return Screenshot;

});
