define([
  "app"
],
function () {
  "use strict";
  var Message = Backbone.Model.extend({
    defaults: {
      type: "alert-info",
      numFound: 0,
      q: "",
      init: true
    }
  });
  return Message;
});
