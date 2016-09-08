define([
  "app"
],
function () {
  "use strict";
  var LoadingIndicator = Backbone.View.extend({
    el: false,
    template: "loading-indicator"
  });
  return LoadingIndicator;

});
