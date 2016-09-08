define([
  "views/search-apps",
  "conf",
  "device",
  "views/wast",
  "views/search-results-message",
  "models/message"
],
function (SearchApps, conf, device, WastView, SearchResultMessage, MessageModel) {
  "use strict";

  var SearchPage = WastView.extend({

    template: "search-page",

    initialize: function () {
      this.options.listenResize = true;
      WastView.prototype.initialize.call(this, this.options);

      this.setViews({
        "#applications-list": new SearchApps({
          text: this.options.query,
          count: this.count,
          parent: this
        }),
        ".message": new SearchResultMessage({
          model: new MessageModel(),
          parent: this
        })
      });

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
        this.getView("#applications-list").updateCount(this.count);
      }
    }


  });

  return SearchPage;

});
