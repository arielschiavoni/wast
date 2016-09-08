define([
  "app",
  "models/application"
],
// Map dependencies from above array.
  function (app, ApplicationModel) {
    "use strict";

    var RelatedAppCollection = Backbone.Collection.extend({

      model: ApplicationModel,

      initialize: function (models, options) {
        this.isLoading = false;
        this.url = "/related/" + options.applicationId + "/" + options.count || 4;
      },

      sync: function(method, model, options){
        this.isLoading = true;

        var success = options.success,
          self = this;

        options.success = function (apps) {
          success(apps);
          self.isLoading = false;
          self.trigger("fetch:end", apps);
        };

        return Backbone.sync(method, model, options);
      },

      // Fetch method when called triggers 'fetch' event. That way we can
      // set loading state on components.
      fetch: function(options) {
        this.trigger("fetch:start", options);
        return Backbone.Collection.prototype.fetch.call(this, options);
      }

    });

    return RelatedAppCollection;

  });


