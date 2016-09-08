define([
  "app"
],
function () {
  "use strict";
  var Message = Backbone.View.extend({
    serialize: function () {
      return this.model.toJSON();
    }
  });
  return Message;
});

