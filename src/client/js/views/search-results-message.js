define([
  "app",
  "views/message"
],
function (app, Message) {
  "use strict";

  var SearchResultMessage = Message.extend({

    template: "message",

    initialize: function () {
      Message.prototype.initialize.call(this, this.options);

      var self = this;

      this.options.parent.on("search:ready", function (results) {
        self.model.set({
          "type": results.numFound > 0 ? "alert-info" : "alert-block",
          "numFound": results.numFound,
          "q": results.q,
          "init": false
        });
      });

      this.model.on("change", function () {
        self.render();
      });
    }

  });

  return SearchResultMessage;

});
