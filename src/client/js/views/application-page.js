define([
  "app",
  "models/application",
  "views/screenshots",
  "views/application-seccondary-details",
  "views/application-life-cycle",
  "views/review-graph"

],
function (app, AppModel, Screenshots, ApplicationSeccondaryDetails, ApplicationLifeCycle, ReviewGraph) {
  "use strict";

  var ApplicationPage = Backbone.View.extend({

    className: "application two",

    template: "application-page",

    initialize: function () {

      this.model = new AppModel({
        _id: this.options.id
      });

      var self = this;
      this.model.on("change", function (model) {

        self.insertViews({
          "#review-graph": new ReviewGraph({
            applicationId: model.get("_id")
          }),
          "#screenshots": new Screenshots({
            screenshots: model.get("screenshots")
          }),
          "#seccondary": new ApplicationSeccondaryDetails({
            model: model
          }),
          "#life-cycle": new ApplicationLifeCycle({
            //clone the model to avoid re render the view when some progress arrives.
            model: model.clone()
          })

        });

        self.render();

      });

      this.model.fetch();

    },

    serialize: function () {
      return this.model.toJSON();
    }


  });

  return ApplicationPage;

});
