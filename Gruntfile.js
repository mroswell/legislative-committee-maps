/*

This Grunt script sets up a local dev server and enables live reload when source files are 
changed.

*/

module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-watch");
  
  grunt.initConfig({
    connect: {
      dev: {
        options: {
          livereload: true
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      html: {
        files: "*.html",
        tasks: ["nothing"]
      },
      js: {
        files: ["js/*.js"],
        tasks: ["browserify"]
      }
    }
  });

  //task to trigger reload
  grunt.registerTask("nothing", function() {});
  
  //default task
  grunt.registerTask("default", ["browserify", "connect:dev", "watch"]);
  
  //build JavaScript
  grunt.registerTask("browserify", function() {
    
    var done = this.async();
    
    var browserify = require("browserify");
    var fs = require("fs");
    
    var builder = browserify();
    var output = fs.createWriteStream("bundle.js");
    builder.add("./js/script.js");
    builder.bundle().pipe(output).on("finish", function() {
      done();
    });
    
  });

};
