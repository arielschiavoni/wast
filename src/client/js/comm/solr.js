define([
  "conf"
],
  function (conf) {
    "use strict";

    var host = conf.solrEndpoint || "http://localhost:8983";

    return {

      buildQueryParams: function (pQuery) {

        var params = {
          q: "*:*",
          start: 0,
          rows: 10,
          wt: "json"
        },
        query = $.extend({
          text: "*:*",
          categories: [],
          price: null,
          sort: null,
          page: 0,
          promoted: null,
        }, pQuery);

        params.q = query.text || "*:*";
        params.start = query.start !== 0 ? query.start : query.page * query.rows;
        params.rows = query.rows;

        //Categories
        if (query.categories.length && query.categories !== "All") {
          if (!params.fq) {
            params.fq = [];
          }
          for (var i = 0; i < query.categories.length; i += 1) {
            params.fq.push("categories:" + "\"" + query.categories[i] + "\"");
          }
        }
        //Price
        if (query.price) {
          if (!params.fq) {
            params.fq = [];
          }
          params.fq.push("price:" + query.price);
        }

        //Sort
        if (query.sort) {
          params.sort = query.sort.field + " " + query.sort.direction;
        }

        if(query.releaseDate) {
          if (!params.fq) {
            params.fq = [];
          }
          params.fq.push("releaseDate:" + "[" + query.releaseDate.toJSON() + " TO NOW]");
        }

        if(query.promoted) {
          if (!params.fq) {
            params.fq = [];
          }
          params.fq.push("promoted:true");
        }

        return params;

      },

      url: function () {
        return host + "/solr/select/";
      },

      suggest: function () {
        return host + "/solr/suggest/";
      }

    };
  });
