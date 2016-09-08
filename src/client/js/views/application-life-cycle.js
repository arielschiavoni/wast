define([
  "app"
],
function (app) {
  "use strict";

  var ApplicationLifeCycle = Backbone.View.extend({

    initialize: function () {

      this.template = this.options.template || "application-life-cycle";

      var self = this;

      this.model.on("change:status", function (model, status) {
        console.log("change:status to ----->", status);
        if (status === "installed") {
          self.model.set({
            downloads: self.model.get("downloads") + 1
          });
          self.model.save();
          //notify application installed
          app.trigger("application:installed", model);
        }
        self.render();
      });

      this.model.on("change:progress", function (model, progress) {
        self.$(".bar").width(progress + "%");
        self.$(".status").text(model.get("status").charAt(0).toUpperCase() + model.get("status").slice(1) + "... " + progress + "%");
      });

      this.model.on("change:reviews", function () {
        self.render();
      });

      app.io.on("application status " + this.model.get("_id"), function (data) {
        self.model.set({
          status: data.status,
          progress: data.progress
        });
      });
      app.io.on("application error " + this.model.get("_id"), function (data) {
        self.model.set({
          status: data.status
        });
      });

      app.io.on("application update " + this.model.get("_id"), function (app) {
        var attrs = self.model.parse(app);
        self.model.set(attrs);
      });

    },

    stopListening: function () {
      //call to parent remove
      Backbone.View.prototype.stopListening.call(this);
      app.io.removeAllListeners("application status " + this.model.get("_id"));
      app.io.removeAllListeners("application error " + this.model.get("_id"));
      app.io.removeAllListeners("application update " + this.model.get("_id"));
    },

    events: {
      "click #download": "download",
      "click #cancel": "cancel",
      "click #pause": "pause",
      "click #resume": "resume",
      "click #write-review": "writeReview"
    },

    download: function (evt) {
      if (evt) {
        evt.preventDefault();
      }
      this.model.download({
        retry: _.bind(this.download, this)
      });
    },

    cancel: function (evt) {
      if (evt) {
        evt.preventDefault();
      }
      this.model.cancel();
    },

    pause: function (evt) {
      if (evt) {
        evt.preventDefault();
      }
      this.model.pause();
    },

    resume: function (evt) {
      if (evt) {
        evt.preventDefault();
      }
      this.model.resume();
    },

    writeReview: function (evt) {
      if (evt) {
        evt.preventDefault();
      }
      app.trigger("application:write-review", this.model);
    },

    serialize: function () {
      var model = this.model.toJSON();
      model.listed = model.status === "listed";
      model.entitled = model.status === "entitled";
      model.canceled = model.status === "canceled";
      model.installed = model.status === "installed";
      model.paused = model.status === "paused";
      model.processing = model.status === "processing";
      model.downloading = model.status === "downloading";
      model.installing = model.status === "installing";
      return model;
    }


  });

  return ApplicationLifeCycle;

});

