define([
  "app",
  "views/application",
  "device",
  "conf"
],
function (app, Application, device, conf) {
  "use strict";

  var ApplicationPromoted = Application.extend({

    tagName: "div",

    className: "item",

    template: "application-promoted",

    //instead of image click you should go to details when
    //holding on the carousel's item.
    events: {
      "hold": "goToDetails"
    },

    prepareForDevice: function () {
      var hasChanged = false,
          template = "application-promoted";

      if(device.screen.fitsInto(conf.screen.steps[0])) {
        template = "application-promoted";
      }

      if(device.screen.fitsInto(conf.screen.steps[1]) ||
        device.screen.fitsInto(conf.screen.steps[2])) {
        template = "application-promoted-extended";
      }

      hasChanged = this.template !== template;
      this.template = template;
      return hasChanged;
    }
  });

  return ApplicationPromoted;

});
