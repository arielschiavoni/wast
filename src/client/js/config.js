// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["main"],

  paths: {

    // Libraries.
    jquery: "libs/jquery",
    "_": "libs/underscore",
    backbone: "libs/backbone",
    bootstrap: "libs/bootstrap",
    handlebars: "libs/handlebars.runtime",
    hammer: "libs/hammer",
    conf: "configuration/conf",
    device: "plugins/device"
  },

  shim: {
    // Backbone library depends on underscore and jQuery.
    backbone: {
      deps: ["_", "jquery"],
      exports: "Backbone"
    },

    handlebars: {
      exports: "Handlebars"
    },

    templates: {
      deps: ["handlebars"]
    },

    bootstrap: ["jquery"],

    // Backbone.LayoutManager depends on Backbone.
    "plugins/backbone.layoutmanager": ["backbone"],
    "plugins/jquery.hammer": ["jquery"],
    "plugins/jquery.inview": ["jquery"]
  }

});
