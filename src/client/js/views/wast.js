define([
  "app",
  "views/loading-indicator"
],
function (app, LoadingIndicator) {
  "use strict";

  var Wast = Backbone.View.extend({

    initialize: function () {
      this.prepareForDevice();

      if(this.options.listenResize) {
        //performance improvement to avoid excecute code
        //in every resize windows event.
        $(window).on("resize", function() {
          if(this.resizeTO) {
            clearTimeout(this.resizeTO);
          }
          this.resizeTO = setTimeout(function() {
            $(this).trigger("resizeEnd");
          }, 500);

        });
        $(window).on("resizeEnd", $.proxy(this.resize, this));
        this.stopListening = function () {
          Backbone.View.prototype.stopListening.call(this);
          //remove resize listener
          $(window).off("resize");
          $(window).off("resizeEnd");
        };
      }
    },

    prepareForDevice: function () {
      return false;
    },

    resize: function () {
      //check if the temaplate has changed

      /*
      console.group(this.template);
      console.log("outerWidth:", evt.target.outerWidth);
      if(!this.template) {
        console.log("%cno template", "color:red;");
        console.log("this:", this);
      }
      */

      if(this.prepareForDevice()) {
        /*
        console.log("%crender:true", "color:green;");
        console.log("new template:", this.template);
        console.log("this:", this);
        */
        this.render();
      }
      //console.groupEnd();
    },

    //obj is a collection or model that can trigger fetch:start|end events.
    loading: function (obj) {
      this.listenToOnce(obj, "fetch:start", function () {
        this.insertView(new LoadingIndicator());
      });

      this.listenToOnce(obj, "fetch:end", function () {
        this.getView(function (view) {
          return view.template === "loading-indicator";
        }).remove();
      });
    },



  });

  return Wast;

});
