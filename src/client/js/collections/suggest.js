define([
  "app",
  "comm/solr"
],
// Map dependencies from above array.
  function (app, solr) {
    "use strict";

    var SuggestCollection = Backbone.Collection.extend({

      url: solr.suggest,

      sync: function(method, model, options) {
        var success = options.success;
        options.dataType = "jsonp";
        options.jsonp = "json.wrf";
        options.data = solr.buildQueryParams(this.options);
        options.traditional = true;
        options.success = function (data) {
          success(data.spellcheck.suggestions[1].suggestion);
        };
        return Backbone.sync(method, model, options);
      }

    });

    return SuggestCollection;

  });


