define([
  "collections/related",
  "views/application",
  "views/wast"
],
function (RelatedCollection, Application, WastView) {
  "use strict";

  var RelatedApps = WastView.extend({

    tagName: "ul",

    className: "applications thumbnails",

    initialize: function () {
      WastView.prototype.initialize.call(this, this.options);
      //set promoted apps collection.
      this.collection = new RelatedCollection([], {
        applicationId: this.options.applicationId,
        count: this.options.count
      });

      var self = this;

      this.collection.on("sync", function (appCollection) {
        appCollection.each(function (app) {
          self.add(app);
        });
      });

      this.loading(this.collection);
      this.collection.fetch();
    },

    add: function (item) {
      this.insertView(new Application({
        listenResize: false,
        model: item
      })).render();
    }


  });

  return RelatedApps;

});
