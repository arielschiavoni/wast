define([
  "app",
  "views/promoted-apps",
  "views/top-apps"
],
function (app, PromotedApps, TopApps) {
  "use strict";

  var HomePage = Backbone.View.extend({

    template: "home-page",

    initialize: function () {
      this.setViews({
        "#value-prop": new PromotedApps(),
        "#top-applications-list": new TopApps({
          paginate: false
        })
      });
    },

    events: {
      "click h2": function () {
        app.router.navigate("/top-apps", true);
      }
    }


  });

  return HomePage;

});
