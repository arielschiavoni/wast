define([
  "app",
  "models/model"
],
function (app, Model) {
  "use strict";

  var Session = Model.extend({

    urlRoot: function() {
      return Model.prototype.urlRoot + "/session";
    },

    parse: function (res) {
      //set time stap to force request image when user changes it.
      if (res.useravatar) {
        res.useravatar += ("?" + new Date().getTime());
      }
      return res;
    },

  });

  return Session;

});
