define([
  "app",
  "views/application-life-cycle",
  "views/wast"
],
function (app, ApplicationLifeCycle, WastView) {
  "use strict";

  var Application = WastView.extend({

    tagName: "li",

    className: "application one hidden",

    template: "application",

    initialize: function () {
      this.options.listenResize = this.options.listenResize === false ? false : true;
      WastView.prototype.initialize.call(this, this.options);
      this.setView("#life-cycle", new ApplicationLifeCycle({
        model: this.model,
        template: "application-life-cycle-small"
      }));
    },

    events: {
      "click img": "goToDetails"
    },

    serialize: function () {
      return this.model.toJSON();
    },

    goToDetails: function () {
      app.router.navigate("application/" + this.model.id, true);
    },

    afterRender: function () {
      //CSS3 Transition doesn't work for dynamically injected elements
      //http://stackoverflow.com/questions/11784912/adding-element-to-dom-and-applying-class-with-jquery-doesnt-apply-css3-transiti
      setTimeout($.proxy(function () {
        this.$el.removeClass("hidden");
      }, this), 0);
    }


  });

  return Application;

});
