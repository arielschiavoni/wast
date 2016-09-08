define([
  "app",
  "conf",
  "views/wast"
],
function (app, conf) {
  "use strict";


  var Notify = Backbone.View.extend({

    template: "notify",

    className: "notify one success",

    timeoutId: null,

    initialize: function () {
      var self = this;
      this.notifications = new Backbone.Collection();

      this.notifications.on("add", function () {
        self.render();
      });

      app.session.on("change:authenticated", function (model, auth) {
        if (auth) {
          self.notifications.add(new Backbone.Model({
            text: "User has been authenticated successfully."
          }));
        }
      });

      app.on("application:installed", function (appModel) {
        self.notifications.add(new Backbone.Model({
          text: appModel.get("name") + " has been installed successfully."
        }));
      });

      app.on("application:review:success", function () {
        self.notifications.add(new Backbone.Model({
          text: "Your review was submited successfully."
        }));
      });

      this.$el.hammer({
        "swipe_max_touches": 0,
        "swipe_velocity": 0
      });

    },

    events: {
      "click .close": "close",
      "transitionend": "reset",
      "mouseenter" : "mouseEnter",
      "mouseleave": "mouseLeave",
      "swipedown": "close"
    },

    mouseEnter: function () {
      clearTimeout(this.timeoutId);
      this.viewing = true;
    },

    mouseLeave: function () {
      var self = this;
      this.timeoutId = setTimeout(function () {
        self.close();
      }, conf.notification.timeout);
      this.viewing = false;
    },

    reset: function () {
      this.notifications.reset();
    },

    close: function () {
      this.$el.css({
        bottom: -this.$el.outerHeight()
      });
      this.viewing = false;
      this.notifications.reset();
    },

    afterRender: function () {
      console.log("afterRender");
      var self = this;
      if (this.notifications.length > 0) {
        this.$el.css({
          bottom: 0
        });
      }
      if(!this.viewing) {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(function () {
          self.close();
        }, conf.notification.timeout);
      }

    },

    serialize: function () {
      return {
        notifications: this.notifications.toJSON()
      };
    }

  });

  return Notify;

});
