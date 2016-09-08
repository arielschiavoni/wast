define([
  "app"
],
function (app) {
  "use strict";

  var LoginPage = Backbone.View.extend({

    template: "login-page",

    events: {
      "submit #sign-in-form": "login"
    },

    initialize: function () {
      this.template = this.options.template || "login-page";
      this.retry = this.options.retry;
      app.session.set("errors", null);
    },

    login: function (evt, cbModal) {
      var target,
          self = this,
          prevText;

      if (cbModal) {
        target = $(evt.target);
        prevText = $(evt.target).text();
      } else {
        target = this.$("#sign-in-button");
      }
      target.text("Logging in...").prop("disabled", true);
      evt.preventDefault();

      app.session.set({
        username: this.$("#username").val(),
        password: this.$("#password").val()
      });
      app.session.save({}, {
        wait: true,
        error: function (model, xhr) {
          var res = JSON.parse(xhr.responseText);
          model.set("errors", res.errors);
          self.render();
          if (cbModal) {
            target.text(prevText).prop("disabled", false);
          }
        },
        success: function () {
          if (cbModal) {
            cbModal();
          }
          if (self.retry) {
            self.retry();
          } else {
            app.router.navigate("", true);
          }
        }
      });

    },

    serialize: function () {
      return app.session.toJSON();
    }

  });

  return LoginPage;

});
