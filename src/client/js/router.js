define([
  // Application.
  "app",
  "views/navbar",
  "views/notify",
  "views/modal",
  "views/home-page",
  "views/top-apps-page",
  "views/search-page",
  "views/application-page",
  "views/login-page",
  "views/register-page",
  "views/my-account-page"
],

function(app, NavBar, Notify, Modal, HomePage, TopAppsPage, SearchPage,
  ApplicationPage, LoginPage, RegisterPage, MyAccountPage) {

  "use strict";

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "top-apps": "topApps",
      "search/:query": "search",
      "application/:id": "application",
      "login": "login",
      "logout": "logout",
      "register": "register",
      "my-account": "profile"
    },

    //Router initialization
    initialize: function () {
      // Use main layout and set Views.
      app.useLayout("layout");

      //Set principal views to the layout
      //and render it.
      app.layout.setViews({
        ".navbar-inner": new NavBar({
          router: this
        }),
        "#notify": new Notify(),
        "#modal": new Modal({
          router: this
        })
      }).render();

    },

    index: function () {
      //just render the page and not the entire layout.
      // var homePage = new HomePage();
      // app.layout.setViews({
      //   "#main-content": homePage
      // });
      // homePage.render();
    },

    topApps: function () {
      var topAppsPage = new TopAppsPage();
      app.layout.setViews({
        "#main-content": topAppsPage
      });
      topAppsPage.render();
    },

    search: function (query) {
      var searchPage = new SearchPage({
        query: query
      });
      app.layout.setViews({
        "#main-content": searchPage
      });
      searchPage.render();
    },

    application: function (id) {
      var applicationPage = new ApplicationPage({
        id: id
      });
      app.layout.setViews({
        "#main-content": applicationPage
      });
      applicationPage.render();
    },

    login: function () {
      if(!app.session.get("authenticated")) {
        var loginPage = new LoginPage();
        app.layout.setViews({
          "#main-content": loginPage
        });
        loginPage.render();
      } else {
        this.navigate("my-account", true);
      }
    },

    logout: function () {
      this.navigate("", true);
    },

    register: function () {
      var registerPage = new RegisterPage();
      app.layout.setViews({
        "#main-content": registerPage
      });
      registerPage.render();
    },

    profile: function () {
      if(app.session.get("authenticated")) {
        var myAccountPage = new MyAccountPage();
        app.layout.setViews({
          "#main-content": myAccountPage
        });
        myAccountPage.render();
      } else {
        this.navigate("", true);
      }
    }

  });

  return Router;

});
