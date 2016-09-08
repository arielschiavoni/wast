define([
  "app",
  "views/image-file",
  "models/user"
],
function (app, ImageFile, UserModel) {
  "use strict";

  var RegisterPage = Backbone.View.extend({

    template: "register-page",

    initialize: function () {
      this.model = new UserModel();
      this.setView("#image-file", new ImageFile());

      var self = this;
      this.model.on("invalid", function (model, errors) {
        model.set("errors", errors);
        self.render();
      });
    },

    events: {
      "submit #sign-up-form": "register"
    },

    register: function (evt) {
      evt.preventDefault();

      var self = this,
          imageFileModel = this.getView("#image-file").model;

      this.$("#sign-up-button").text("Processing...").prop("disabled", true);


      this.model.set({
        username: this.$("#username").val(),
        password: this.$("#password").val(),
        repassword: this.$("#repeat-password").val(),
        email: this.$("#email").val(),
        avatar: imageFileModel.get("data")
      });

      this.model.save(null, {
        error: function (model, xhr) {
          var res = JSON.parse(xhr.responseText);
          model.set("errors", res.errors);
          self.render();
        },
        success: function (model) {
          model.set("errors", null);
          app.session.set("username", model.get("username"));
          app.router.navigate("/login", true);
        }
      });
    },

    serialize: function () {
      return this.model.toJSON();
    }

  });

  return RegisterPage;

});
