define([
  "app",
  "models/image-file"
],
function (app, ImageFileModel) {
  "use strict";

  var ImageFile = Backbone.View.extend({

    template: "image-file",

    initialize: function () {
      this.model = new ImageFileModel();
      var self = this;
      this.model.on("change", function () {
        self.render();
      });
    },

    events: {
      "change #avatar": "preview"
    },

    preview: function (evt) {
      this.model.loadFile(evt.target.files[0]);
    },

    serialize: function () {
      return this.model.toJSON();
    }

  });

  return ImageFile;

});
