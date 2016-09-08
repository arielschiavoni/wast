
var ApplicationLifeCycle = require("./application-life-cycle").ApplicationLifeCycle;

var LifeCycleManager = function (socket) {
  "use strict";
  this.socket = socket;
  this.applications = {};
};


LifeCycleManager.prototype.download = function(app) {
  "use strict";
  var appLC = new ApplicationLifeCycle(this.socket, app);
  this.applications[app._id] = appLC;
  appLC.start();
};

LifeCycleManager.prototype.cancel = function(app) {
  "use strict";
  var appLC = this.applications[app._id];
  if (appLC) {
    appLC.cancel();
  }
};

LifeCycleManager.prototype.pause = function(app) {
  "use strict";
  var appLC = this.applications[app._id];
  if (appLC) {
    appLC.pause();
  }
};

LifeCycleManager.prototype.resume = function(app) {
  "use strict";
  var appLC = this.applications[app._id];
  if (appLC) {
    appLC.resume();
  }
};

LifeCycleManager.prototype.review = function(app) {
  "use strict";
  this.socket.volatile.emit("application update " + app._id, app);
};

LifeCycleManager.prototype.destroy = function() {
  "use strict";
  var self = this;
  Object.keys(this.applications).forEach(function (key) {
    //this should destroy pending intervals process like download or processing
    self.applications[key].destroy();
  });
};

exports.LifeCycleManager = LifeCycleManager;
