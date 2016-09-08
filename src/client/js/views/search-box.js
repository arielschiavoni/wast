define([
  "app",
  "models/suggest-term",
  "views/wast"
],
function (app, SuggestTerm) {
  "use strict";

  var //BACKSPACE_KEY = 8,
      TAB_KEY = 9,
      ENTER_KEY = 13,
      ESCAPE_KEY = 27,
      //SPACE_KEY = 32,
      ARROW_UP_KEY = 38,
      ARROW_DOWN_KEY = 40;
      //NUMBERS_START_KEY = 48,
      //NUMBERS_END_KEY = 57,
      //ALPHA_START_KEY = 65,
      //ALPHA_END_KEY = 90,
      //ALPHA_UP_START_KEY = 97,
      //ALPHA_UP_END_KEY = 122;

  var SearchBox = Backbone.View.extend({

    template: "search-box",

    initialize: function () {
      var self = this;
      this.model = new SuggestTerm();
      this.model.on("change:suggestions", function (model, suggestions) {
        self.renderSuggestion(suggestions);
        console.log(suggestions);
      });
    },

    renderSuggestion: function (suggestions) {
      var sContainer = this.$("#suggestions").empty(),
        lineHeight = 30;
      sContainer.height(0);
      suggestions.forEach(function (s) {
        sContainer.append("<li>" + s + "</li>");
      }, this);
      sContainer.height(suggestions.length * lineHeight);
    },

    suggest: function (query) {
      console.log("update terms");
      this.model.set("query", query);
      this.model.fetch();
    },

    events: {
      "keyup .search-query": "search",
      "keypress .search-query": "search",
      "keydown .search-query": "tab",
      "click #suggestions li": function (evt) {
        this.doSearch($(evt.target).text());
      },
      //"mouseleave #suggestions": "close",
      "submit form.navbar-search": function (evt) {
        evt.preventDefault();
      }
    },

    close: function () {
      this.$("#suggestions").empty().height(0);
      this.$(".search-query").val("").blur();
    },

    fill: function () {
      var active = this.$("#suggestions li.active");
      if (active) {
        this.$(".search-query").val(active.text());
      }
    },

    select: function () {
      var active = this.$("#suggestions .active");
      if (active) {
        this.$(".search-query").val(active.getText());
      }
    },

    navigate: function (direction) {
      var items = this.$("#suggestions li"),
          active = this.$("#suggestions .active"),
          activeIndex,
          newActive;
      activeIndex = items.index(active);
      items.removeClass("active");

      if (direction === "down") {
        newActive = (activeIndex + 1) % items.length;
      } else {
        newActive = activeIndex === 0 ? items.length - 1 : (activeIndex - 1) % items.length;
      }
      $(items[newActive]).addClass("active");
    },

    doSearch: function (query) {
      this.close();
      //trigger an event to the router in order to navigate to the search screen
      app.router.navigate("search/" + query, true);
    },

    search: function (evt) {
      console.log(evt.type, evt.keyCode, evt);
      console.log("new");
      //http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
      var query = this.$(".search-query").val(),
          c = evt.keyCode;
      switch(c) {
      case TAB_KEY:
        this.fill();
        evt.preventDefault();
        break;
      case ENTER_KEY:
        this.doSearch(query);
        break;
      case ESCAPE_KEY:
        this.close();
        break;
      case ARROW_UP_KEY:
        this.navigate("up");
        evt.preventDefault();
        break;
      case ARROW_DOWN_KEY:
        this.navigate("down");
        evt.preventDefault();
        break;
      default:
        /*
        if ((c >= ALPHA_START_KEY && c <= ALPHA_END_KEY) ||
            (c >= ALPHA_UP_START_KEY && c <= ALPHA_UP_END_KEY) ||
            (c === SPACE_KEY) || (c === BACKSPACE_KEY) ||
            (c >= NUMBERS_START_KEY && c <= NUMBERS_END_KEY)) {

          this.suggest(query);
        }
        */
        this.suggest(query);
        break;
      }
    },

    tab: function (evt) {
      console.log("keydown", evt.keyCode, evt);
      if(evt.keyCode === TAB_KEY) {
        this.fill();
        evt.preventDefault();
      }
    },

  });

  return SearchBox;

});
