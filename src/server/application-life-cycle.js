
var STATUS = {
  LISTED: "listed",
  ENTITLED: "entitled",
  INSTALLED: "installed",
  PAUSED: "paused",
  PROCESSING: "processing",
  DOWNLOADING: "downloading",
  INSTALLING: "installing"
};


var ApplicationLifeCycle = function (socket, app) {
  "use strict";

  this.socket = socket;
  this.appId = app._id;
  this.size = app.size;
  this.progress = 0;
  this.interval = null;

  this.ticks = null;
  this.remaningTicks = null;
  this.nextTime = null;

};


ApplicationLifeCycle.prototype.createInterval = function (ticks, interval, cb, rTicks) {
  "use strict";
  var self = this,
      remaningTicks = rTicks || ticks;

  this.nextTime = interval;
  this.ticks = ticks;
  return setInterval(function () {
    remaningTicks -= 1;
    self.remaningTicks = remaningTicks;
    self.progress = (ticks - remaningTicks) / ticks;
    self.dispatch();
    if(remaningTicks === 0) {
      clearInterval(self.interval);
      cb();
    }
  }, interval * 1000);
};

ApplicationLifeCycle.prototype.destroy = function () {
  "use strict";
  clearInterval(this.interval);
};

ApplicationLifeCycle.prototype.dispatch = function () {
  "use strict";
  this.socket.volatile.emit("application status " + this.appId, {
    status: this.status,
    progress: Math.floor(this.progress * 100)
  });
};

ApplicationLifeCycle.prototype.start = function () {
  "use strict";
  //step between progress events
  var ticks = Math.floor(Math.random() * 30) + 10,
      processTime = Math.floor(Math.random() * 5) + 2,
      nextTime = processTime / ticks,
      self = this;

  this.status = STATUS.PROCESSING;
  this.interval = this.createInterval(ticks, nextTime, function () {
    self.download();
  });
};

ApplicationLifeCycle.prototype.download = function () {
  "use strict";

  var //0 a 800KB / s
      downloadSpeed = Math.random() * 10800,
      //depends on network speed and app size
      ticks = Math.floor(Math.random() * 50) + 10,
      downloadTime = (this.size * 1024) / downloadSpeed,
      nextTime = downloadTime / ticks,
      self = this;

  this.status = STATUS.DOWNLOADING;
  this.interval = this.createInterval(ticks, nextTime, function () {
    self.install();
  });

};


ApplicationLifeCycle.prototype.install = function () {
  "use strict";

  var ticks = Math.floor(Math.random() * 50) + 10,
      installTime = Math.floor(Math.random() * 15) + 5,
      nextTime = installTime / ticks,
      self = this;

  this.status = STATUS.INSTALLING;
  this.interval = this.createInterval(ticks, nextTime, function () {
    self.installed();
  });

};

ApplicationLifeCycle.prototype.installed = function () {
  "use strict";
  this.status = STATUS.INSTALLED;
  this.progress = 1;
  this.dispatch();
};

ApplicationLifeCycle.prototype.cancel = function () {
  "use strict";
  this.status = STATUS.ENTITLED;
  this.progress = 1;
  this.dispatch();
  this.destroy();
};

ApplicationLifeCycle.prototype.pause = function () {
  "use strict";
  this.status = STATUS.PAUSED;
  this.dispatch();
  this.destroy();
};

ApplicationLifeCycle.prototype.resume = function () {
  "use strict";
  var self = this;
  this.status = STATUS.DOWNLOADING;
  this.interval = this.createInterval(this.ticks, this.nextTime, function () {
    self.install();
  }, this.remaningTicks);
};

exports.ApplicationLifeCycle = ApplicationLifeCycle;
