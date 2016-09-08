define([
  "app",
  "models/model"
],
function (app, Model) {
  "use strict";

  var User = Model.extend({

    urlRoot: function() {
      return Model.prototype.urlRoot + "/users";
    },

    defaults: {
      "username": "",
      "email": "",
      "password": "",
      "repassword": "",
      "avatar": ""
    },

    parse: function (res) {
      //set time stamp to force request image when user changes it.
      if (res.avatar) {
        res.avatar += ("?" + new Date().getTime());
      }
      return res;
    },

    validate: function (attrs) {
      var errors = [];
      if (this.isNew() && attrs.password !== attrs.repassword) {
        errors.push("Passwords doesn't match.");
      }
      return errors.length > 0 ? errors : null;
    }
  });

  return User;

});
