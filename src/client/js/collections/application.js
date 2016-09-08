define([
  "app",
  "models/application",
  "comm/solr"
],
// Map dependencies from above array.
  function (app, AppModel, solr) {
    "use strict";

    var AppCollection = Backbone.Collection.extend({

      model: AppModel,

      url: solr.url,

      initialize: function (models, options) {
        var defaults = {
          text: null,
          price: null,
          categories: [],
          sort: null,
          page: 0,
          rows: 10,
          start: 0
        };
        this.options = _.extend({}, defaults, options);
        this.maxApplications = options.rows;
        this.isLoading = false;
      },

      canLoadMore: function() {
        return this.length === (this.maxApplications * (this.options.page + 1)) && !this.isLoading;
      },

      sync: function(method, model, options){
        this.isLoading = true;

        var success = options.success,
          self = this;

        options.dataType = "jsonp";
        options.jsonp = "json.wrf";
        options.data = solr.buildQueryParams(this.options);
        options.traditional = true;
        //add parameter to avoid reset collection when we are requesting other pages
        if (self.options.page > 0) {
          options.add = true;
        }

        options.success = function (data) {
          var apps = data.response.docs;
          self.numFound = data.response.numFound;
          success(apps);
          self.isLoading = false;
          self.trigger("fetch:end", data);
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

    return AppCollection;

  });


