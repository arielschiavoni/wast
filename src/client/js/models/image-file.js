define([
  "app"
],
function () {
  "use strict";

  var ImageFile = Backbone.Model.extend({

    //load and resize image
    loadFile: function (file) {

      var reader = new FileReader(),
          self = this;

      //clousure to capture the file information
      reader.onload = (function (f) {
        return function (e) {

          var img = new Image();
          img.src = e.target.result;

          img.onload = function () {
            var MAX_WIDTH = 96,
                MAX_HEIGHT = 96,
                canvas = document.createElement("canvas"),
                ctx,
                dataURL;

            canvas.width = MAX_WIDTH;
            canvas.height = MAX_HEIGHT;
            ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0, MAX_WIDTH, MAX_HEIGHT);
            dataURL = canvas.toDataURL("image/jpeg");

            //update model
            self.set({
              fileName: f.name,
              data: dataURL
            });

          };
        };

      })(file);

      //read in the image file as a data URL
      reader.readAsDataURL(file);

    }

  });

  return ImageFile;

});
