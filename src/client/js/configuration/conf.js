define([

],
function () {
  "use strict";

  return {
    screen: {
      steps: [
        "only screen and (min-width: 480px)",
        "only screen and (min-width: 767px)",
        "only screen and (min-width: 980px)"
      ]
    },
    solrEndpoint: "http://solr.wast.dev:8983",
    socketEndpoint: "http://api.wast.dev:8080",
    api: "http://api.wast.dev:8080",
    notification: {
      timeout: 5000
    }
  };
});
