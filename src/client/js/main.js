require([
  // Application.
  "app",

  "conf",

  // Main Router.
  "router",

  //Session
  "models/session"
],

function(app, conf, Router, SessionModel) {

  "use strict";
  // Set empty Session model to be shared in the application.
  app.session = new SessionModel();
  Backbone.history.start({ pushState: true, root: app.root });

  // Set Socket.io and try to connect when user is authenticated
  var connectSocket = function(token) {

    var socket = io.connect(conf.socketEndpoint, {
      query: "token=" + token
    });

    socket.on("connect", function () {
      console.info("authenticated");
    });

    socket.on("disconnect", function () {
      console.log("disconnected");
    });

    socket.on("error", function (reason) {
      console.error("Unable to connect Socket.IO", reason);
    });

    app.io = socket;
  }

  app.session.on("change:authenticated", function (model, authenticated) {
    if (authenticated) {
      connectSocket(model.get("token"));
    }
    // } else if (app.io.socket.connected){
    //   // app.io.socket.disconnect();
    // }
  });

  // Define your master router on the application namespace and trigger all
  // navigation from this instance.
  app.router = new Router();

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on("click", "a:not([data-bypass])", function(evt) {
    // Get the absolute anchor href.
    var href = $(this).attr("href");

    // If the href exists and is a hash route, run it through Backbone.
    if (href && href.indexOf("#") === 0) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events. The Router's internal `navigate` method
      // calls this anyways.  The fragment is sliced from the root.
      Backbone.history.navigate(href, true);
    }
  });

});
