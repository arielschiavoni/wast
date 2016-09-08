define([
  "app",
  "views/search-box"
],
function (app, SearchBox) {
  "use strict";

  var Navbar = Backbone.View.extend({

    template: "navbar",

    className: "container",

    initialize: function () {
      var self = this;

      this.options.router.on("route:index", function () {
        self.reset();
        self.$("#home").addClass("active");
      });

      this.options.router.on("route:topApps", function () {
        self.reset();
        self.$("#top-apps").addClass("active");
      });

      this.options.router.on("route:application", function () {
        self.reset();
      });

      this.options.router.on("route:login", function () {
        self.reset();
        self.$("#login").addClass("active");
      });

      this.options.router.on("route:register", function () {
        self.reset();
      });

      this.options.router.on("route:myApps", function () {
        self.reset();
        self.$("#my-apps").addClass("active");
      });

      this.options.router.on("route:myAccount", function () {
        self.reset();
      });


      app.session.on("change", function () {
        self.render();
      });

      this.setView("#search", new SearchBox());

    },

    reset: function () {
      this.$(".active").removeClass("active");
    },

    events: {
      "click #logout": "logout"
    },

    logout: function () {
      app.session.destroy({
        success: function (model) {
          //clear session model
          model.clear();
        }
      });
    },

    serialize: function () {
      return app.session.toJSON();
    }


  });


  return Navbar;

});
