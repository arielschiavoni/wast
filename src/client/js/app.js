define([
  "jquery",
  "bootstrap",
  "hammer",
  "plugins/jquery.hammer",
  "plugins/jquery.inview",
  "templates",
  "backbone",
  // Plugins.
  "plugins/backbone.layoutmanager"
],

function () {
  "use strict";

  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application.
    root: "/"
  };

  // Localize or create a new JavaScript Template object.
  var JST = window.JST = window.JST || {};

  // Configure LayoutManager with Backbone Boilerplate defaults.
  Backbone.Layout.configure({

    manage: true,

    fetch: function(path) {
      return JST[path];
    }

  });

  // Mix Backbone.Events, modules, and layout management into the app object.
  return _.extend(app, {

    // Helper for using layouts.
    useLayout: function(name) {
      // If already using this Layout, then don't re-inject into the DOM.
      if (this.layout && this.layout.options.template === name) {
        return this.layout;
      }

      // If a layout already exists, remove it from the DOM.
      if (this.layout) {
        this.layout.remove();
      }

      // Create a new Layout.
      var layout = new Backbone.View({
        template: name,
        id: name
      });

      // Insert into the DOM.
      layout.$el.appendTo("#app");

      // Cache the refererence.
      this.layout = layout;

      // Return the reference, for chainability.
      return layout;
    }
  }, Backbone.Events);

});
