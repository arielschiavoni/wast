define([
  "app",
  "comm/solr"
],
// Map dependencies from above array.
  function (app, solr) {
    "use strict";

    var SuggestTerm = Backbone.Model.extend({

      url: solr.suggest,

      sync: function(method, model, options) {
        var success = options.success;
        options.dataType = "jsonp";
        options.jsonp = "json.wrf";
        options.data = {
          wt: "json",
          q: this.get("query")
        };
        options.traditional = true;
        options.success = function (data) {
          var suggestions = [];
          if (data.spellcheck && data.spellcheck.suggestions.length > 0) {
            suggestions = data.spellcheck.suggestions[1].suggestion;
          }
          success({
            suggestions: suggestions
          });
          console.log(model.get("query"), suggestions);
        };
        return Backbone.sync(method, model, options);
      }

    });

    return SuggestTerm;

  });


