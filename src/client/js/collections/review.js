define([
  "app",
  "models/review"
],
// Map dependencies from above array.
  function (app, ReviewModel) {
    "use strict";

    var ReviewCollection = Backbone.Collection.extend({

      model: ReviewModel,

      initialize: function (models, options) {
        this.isLoading = false;
        this.url = "/reviews/" + options.applicationId;
      },

      sync: function(method, model, options){
        this.isLoading = true;

        var success = options.success,
          self = this;
        options.success = function (reviews) {
          success(reviews);
          self.isLoading = false;
          self.trigger("fetch:end", reviews);
        };

        return Backbone.sync(method, model, options);
      },

      // Fetch method when called triggers 'fetch' event. That way we can
      // set loading state on components.
      fetch: function(options) {
        this.trigger("fetch:start", options);
        return Backbone.Collection.prototype.fetch.call(this, options);
      },

      /*
      comparator: function(a, b) {
        var dateA = new Date(Date.parse(a.get("originalDate"))),
            dateB = new Date(Date.parse(b.get("originalDate")));

        if (dateA > dateB) {
          return 1;
        }
        if (dateA < dateB) {
          return -1;
        }
        return 0;
      },
      */

    });

    return ReviewCollection;

  });


