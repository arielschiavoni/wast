define([
  "app",
  "models/review"
],
function (app, Review) {
  "use strict";

  var WriteReview = Backbone.View.extend({

    template: "write-review-modal",

    initialize: function () {
      this.retry = this.options.retry;

      this.model = new Review();
      this.model.set({
				"application_id": this.options.application.get("_id")
      });

    },

    events: {
      "click #rating i": "rate"
    },

    rate: function (evt) {
      var rating = $(evt.target).data("rating");
      this.updateRating(rating);
      this.model.set("rating", rating);
    },

    afterRender: function () {
      var rating = this.model.get("rating") || 0;
      this.updateRating(rating);
    },

    updateRating: function (rating) {
      this.$("#rating i").attr("class", "").each(function (i, el) {
        $(el).addClass(i < rating ? "icon-star" : "icon-star-empty");
      });
    },

    post: function (evt, cbModal) {
      var target,
          self = this,
          prevText;

      target = $(evt.target);
			prevText = $(evt.target).text();
      target.text("Sending...").prop("disabled", true);
      evt.preventDefault();

      function renderErrors(model, errors) {
        model.set("errors", errors);
        self.render();
        target.text(prevText).prop("disabled", false);
      }

      this.model.once("invalid", function (model, errors) {
        renderErrors(model, errors);
      });

      this.model.set({
        comment: this.$("#comment").val()
      });

      function save() {
        self.model.save(null, {
          wait: true,
          error: function (model, xhr) {
            var res = JSON.parse(xhr.responseText);
            renderErrors(model, res.errors);
          },
          success: function (data) {
            cbModal();
            app.trigger("application:review:success", data);
          },
          retry: save
        });
      }
      save();
    },

    serialize: function () {
      return this.model.toJSON();
    }

  });

  return WriteReview;

});
