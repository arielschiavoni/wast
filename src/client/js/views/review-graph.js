define([
  "app",
  "models/review-graph"
],
function (app, ReviewGraphModel) {
  "use strict";

  var ReviewsGraph = Backbone.View.extend({

    template: "review-graph",

    initialize: function () {

      this.model = new ReviewGraphModel({
        applicationId: this.options.applicationId
      });

      var self = this;

      app.io.on("application update " + this.options.applicationId, function () {
        self.model.fetch();
      });

      this.model.on("change", function () {
        self.render();
      });
      this.model.fetch();

    },

    serialize: function () {
      return this.model.toJSON();
    },

    afterRender: function () {
      var bars = this.model.get("bars"),
        self = this;
      bars.forEach(function (bar) {
        self.$("#bar-" + bar.stars).width(bar.percentage + "%");
      });
    }

  });

  return ReviewsGraph;

});
