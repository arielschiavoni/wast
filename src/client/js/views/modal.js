define([
  "app",
  "conf",
  "views/login-page",
  "views/write-review"
],
function (app, conf, LoginPage, WritreReview) {
  "use strict";

  var Modal = Backbone.View.extend({

    template: "modal",

    className: "modal one fade",

    initialize: function () {
      var self = this;

      this.model = new Backbone.Model({
        title: "Title",
        primaryAction: "Save Changes"
      });

      this.options.router.on("route:register", function () {
        self.$el.modal("hide");
      });

      app.on("login:required", function (retry) {

        self.model.set("title", "Sign in");
        self.model.set("primaryAction", "Sign in");

        var loginPage = new LoginPage({
          template: "login-modal",
          retry: retry
        });

        self.primaryAction = function (evt) {
          loginPage.login(evt, function () {
            self.$el.modal("hide");
          });
        };
        self.setView(".modal-body", loginPage);
        self.render();
        self.$el.modal("show");

      });

      app.on("application:write-review", function (appModel) {

        self.model.set("title", "Write Review");
        self.model.set("primaryAction", "Submit");

        var writreReview = new WritreReview({
          template: "write-review-modal",
          application: appModel
        });

        self.primaryAction = function (evt) {
          writreReview.post(evt, function () {
            self.$el.modal("hide");
          });
        };

        self.setView(".modal-body", writreReview);
        self.render();
        self.$el.modal("show");

      });

    },

    primaryAction: function () {
      console.log("primaryAction!");
    },

    events: {
      "click .btn-primary": "primaryAction",
      "keydown": "enter"
    },

    enter: function (evt) {
      if(evt.keyCode === 13) {
        evt.preventDefault();
        evt.target = this.$(".btn-primary");
        this.primaryAction(evt);
      }
    },

    serialize: function () {
      return this.model.toJSON();
    }

  });

  return Modal;

});
