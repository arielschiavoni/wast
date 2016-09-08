define([
  "app",
  "conf"
],
function (app, conf) {
  "use strict";

  var Model = Backbone.Model.extend({

    urlRoot: conf.api,

    sync: function(method, model, options){
      var error = options.error,
          retry = options.retry;
      options.error = function(resp) {
        //401 Unauthorized
        //The request requires user authentication.
        if(resp.status === 401) {
          if (retry) {
            app.trigger("login:required", function () {
              //var args = arguments;
              //we have to wait until socket is restablished
              app.io.once("connect", function () {
                retry();
                console.info("retrying previous action after successfully reestablished socket authorized connection");
              });
            });
          } else {
            app.router.navigate("/login", true);
          }
        } else {
          if (error) {
            error(resp);
          }
        }
      };
      return Backbone.sync(method, model, options);
    },

    nonCRUDOperation: function (urlSegment, options) {
      return (this.sync || Backbone.sync).call(this, null, this, _.extend({
        url: this.url() + "/" + urlSegment
      }, options));

    }

  });
  return Model;

});
