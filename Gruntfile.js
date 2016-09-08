"use strict";

module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    clean: ["dist"],

    jshint: {
      all: [
        "Gruntfile.js",
        "client/collections/*.js",
        "client/comm/*.js",
        "client/configuration/*.js",
        "client/models/*.js",
        "client/views/*.js",
        "client/plugins/device.js",
        "client/app.js",
        "client/config.js",
        "client/main.js",
        "client/router.js",
        "server/**/*.js"
      ],
      options: {
        jshintrc: ".jshintrc"
      }
    },

    handlebars: {
      compile: {
        files: {
          "src/client/js/templates.js": [
            "src/client/templates/**/*.hbs"
          ]
        },
        options: {
          namespace: "JST",
          processName: function(filename) {
            // funky name processing here
            return filename.replace(/^app\/templates\//, "").replace(/\.hbs$/, "");
          }
        }
      }
    },

    compass: {
      dev: {
        options: {
          sassDir: "src/client/css",
          cssDir: "src/client/css",
          noLineComments: false,
          force: true,
          debugInfo: true,
          // relativeassets: true,
          config: ".compass.rb"
        }
      },
      prod: {
        options: {
          sassDir: "src/client/css",
          cssDir: "src/client/css",
          outputStyle: "compressed",
          noLineComments: true,
          force: true,
          // relativeassets: true,
          config: ".compass.rb"
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: "src/client/js",
          name: "libs/almond",
          include: "app",
          mainConfigFile: "src/client/js/config.js",
          out: "dist/js/<%= pkg.name %>.js",
          wrap: true,
          optimize: "uglify"
        }
      }
    },

    uglify: {
      dist: {
        files: {
          "dist/js/modernizr.min.js": ["src/client/js/libs/modernizr.js"]
        }
      }
    },

    copy: {
      dist: {
        files: [{
          src: "src/client/css/main.css",
          dest: "dist/css/<%= pkg.name %>.css"
        }, {
          src: "src/client/index.html",
          dest: "dist/index.html"
        }, {
          expand: true,
          cwd: "src/client/fonts/",
          src: "**",
          dest: "dist/fonts/"
        }]
      }
    },

    useref: {
      // specify which files contain the build blocks
      html: "dist/index.html",
      // explicitly specify the temp directory you are working in
      temp: "dist/tmp/"
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: "src/client/images/",
          src: "**",
          dest: "dist/images/",
        }]
      }
    },

    compress: {
      dist: {
        options: {
          mode: "zip",
          archive: "dist.zip"
        },
        expand: true,
        cwd: "dist/",
        src: ["**"]
      }
    },

    // // default watch configuration
    watch: {
      jshint: {
        files: "<config:jshint.files>",
        tasks: "jshint"
      },
      handlebars: {
        files: [
          "src/client/templates/**/*.hbs"
        ],
        tasks: "handlebars"
      },
      compass: {
        files: [
          "src/client/css/**/*.{scss,sass}"
        ],
        tasks: "compass:dev"
      }
    }

  });

  // Require needed grunt-modules
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-handlebars");
  grunt.loadNpmTasks("grunt-contrib-compass");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-useref");
  grunt.loadNpmTasks("grunt-contrib-imagemin");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-mocha");


  // Define tasks
  // TODO review excluded mocha task due socket.io.
  grunt.registerTask("default", ["clean", "jshint", "handlebars", "compass:prod",
    "uglify", "requirejs", "copy", "useref"]);

  grunt.registerTask("build", ["default", "imagemin", "compress"]);

};
