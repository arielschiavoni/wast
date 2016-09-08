define([
  "conf",
  "device",
  "views/wast",
  "views/reviews",
  "views/related-apps"
],
function (conf, device, WastView, Reviews, RelatedApps) {
  "use strict";

  var ApplicationSeccondaryDetails = WastView.extend({

    className: "accordion one",

    template: "application-seccondary-accordion",

    initialize: function () {
      this.options.listenResize = true;
      WastView.prototype.initialize.call(this, this.options);
    },

    serialize: function () {
      return this.model.toJSON();
    },

    events: {
      //this events happens when an acordion panel is shown
      "show #reviews":      "addReviews",
      "show #related-apps": "addRelatedApps",
      //this events are for tab switching, by default it doesn´t trigger events for the
      //panel is shown
      "click [data-toggle=tab][href=#reviews]": "addReviews",
      "click [data-toggle=tab][href=#related-apps]": "addRelatedApps"
    },

    addReviews: function () {
      var view = this.getView("[data-container=reviews]");
      if (!view) {
        this.insertView("[data-container=reviews]", new Reviews({
          applicationId: this.model.get("_id")
        })).render();
      }
    },

    addRelatedApps: function () {
      var view = this.getView("[data-container=related-apps]");
      if (!view) {
        this.insertView("[data-container=related-apps]", new RelatedApps({
          applicationId: this.model.get("_id"),
          count: this.countRelatedApps
        })).render();
      }
    },

    prepareForDevice: function () {
      var hasChanged = false,
          countRelatedApps = 4,
          appPerStep = [4, 6, 8],
          template = "application-seccondary-accordion";
      //default values due to some weird behavior with Modernizr.mq used into the
      //device.screen.fitsInto method.
      this.el.className = "accordion one";

      if(device.screen.fitsInto(conf.screen.steps[0])) {
        template = "application-seccondary-accordion";
        this.el.className = "accordion one";
      }

      if(device.screen.fitsInto(conf.screen.steps[1]) ||
        device.screen.fitsInto(conf.screen.steps[2])) {

        template = "application-seccondary-tabs";
        this.el.className = "tabbable one";
      }

      conf.screen.steps.forEach(function (step, index) {
        if(device.screen.fitsInto(step)) {
          countRelatedApps = appPerStep[index];
        }
      });


      hasChanged = this.template !== template || this.countRelatedApps !== countRelatedApps;
      this.template = template;
      this.countRelatedApps = countRelatedApps;
      this.hasChanged = hasChanged;
      return hasChanged;

    }

  });

  return ApplicationSeccondaryDetails;

});
