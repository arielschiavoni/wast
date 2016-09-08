define([
  "app",
  "views/image-file",
  "models/user"
],
function (app, ImageFile, UserModel) {
  "use strict";

  var MyAccountPage = Backbone.View.extend({

    template: "my-account-page",

    initialize: function () {
      this.setView("#image-file", new ImageFile());
      var self = this;
      this.model = new UserModel({
        id: app.session.get("userid")
      });
      this.model.fetch();

      this.model.on("invalid", function (model, errors) {
        model.set("errors", errors);
        self.render();
      });

      this.model.on("change", function (model) {
        self.getView("#image-file").model.set("data", model.get("avatar"));
        app.session.set("useravatar", model.get("avatar"));
        self.render();
      });
    },

    events: {
      "submit #my-account-form": "update"
    },

    update: function (evt) {
      evt.preventDefault();

      var self = this,
          imageFileModel = this.getView("#image-file").model;

      this.$("#update-button").text("Processing...").prop("disabled", true);

      this.model.set({
        billingAddress: this.$("#billing-address").val(),
        tel: this.$("#tel").val()
      }, {
        silent: true
      });

      //avatar image has changed so I need to replace the image.
      if (/^data:image\/jpeg;base64,/.test(imageFileModel.get("data"))) {
        this.model.set({
          avatar: imageFileModel.get("data")
        }, {
          silent: true
        });
      }

      this.model.save(null, {
        error: function (model, xhr) {
          var res = JSON.parse(xhr.responseText);
          model.set("errors", res.errors);
          self.render();
        },
        success: function (model) {
          model.set("errors", null);
        }
      });
    },

    serialize: function () {
      return this.model.toJSON();
    }

  });

  return MyAccountPage;

});
