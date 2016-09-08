define([
  "collections/application",
  "views/application",
  "views/wast"
],
function (AppCollection, ApplicationTop, WastView) {
  "use strict";

  var TopApps = WastView.extend({

    tagName: "ul",

    className: "applications thumbnails",

    initialize: function () {
      WastView.prototype.initialize.call(this, this.options);
      //set promoted apps collection.
      this.collection = new AppCollection([], {
        sort: {
          field: "downloads",
          direction: "desc"
        },
        rows: this.options.count || 8
      });

      this.paginate = (this.options.paginate === undefined || this.options.paginate === true) ? true : false;

      var self = this;

      this.listenTo(this.collection, "reset", function (appCollection) {
        appCollection.each(function (app) {
          self.add(app);
        });
      });

      this.listenTo(this.collection, "add", function (app) {
        self.add(app);
      });

      this.loading(this.collection);
      this.collection.fetch();
    },

    updateCount: function (count) {
      var collectionSize = this.collection.size();
      if (collectionSize < count) {
        this.collection.options.start = collectionSize;
        this.collection.options.rows = count - collectionSize;
        this.collection.maxApplications = count;
        this.collection.fetch({
          update: true,
          remove: false
        });
      }
    },

    add: function (item) {
      this.insertView(new ApplicationTop({
        model: item
      })).render();
    },

    events: {
      "inview .application:last": "loadMore"
    },

    loadMore: function () {
      if (this.paginate && this.collection.canLoadMore()) {
        // Load next page
        this.collection.options.page += 1;
        this.collection.fetch({
          update: true,
          remove: false
        });
      }
    }

  });

  return TopApps;

});
