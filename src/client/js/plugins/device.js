define([
  
],
function () {
  "use strict";

  return {

    screen: {
      fitsInto: function (mq) {
        return Modernizr.mq(mq);
      }
    },

    isTouchable: function () {
      return Modernizr.touch;
    }

  };


});
