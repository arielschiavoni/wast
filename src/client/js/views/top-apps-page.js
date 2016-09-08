define([
  "views/top-apps",
  "conf",
  "device",
  "views/wast"
],
function (TopApps, conf, device, WastView) {
  "use strict";

  var TopAppsPage = WastView.extend({

    template: "top-apps-page",

    initialize: function () {
      WastView.prototype.initialize.call(this, this.options);
      this.setView("#top-applications-list", new TopApps({
        count: this.count
      }));
    },

    //this method adjust some internal view's properties based on
    //device features like screen size.
    prepareForDevice: function () {
      var hasChanged = false,
          count = 6;

      var appPerStep = [8, 12, 16];
      conf.screen.steps.forEach(function (step, index) {
        if(device.screen.fitsInto(step)) {
          count = appPerStep[index];
        }
      });

      hasChanged = this.count !== count;
      this.count = count;
      return hasChanged;

    },

    resize: function () {
      if(this.prepareForDevice()) {
        this.getView("#top-applications-list").updateCount(this.count);
      }
    }


  });

  return TopAppsPage;

});
