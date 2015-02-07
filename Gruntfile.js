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
      dev: {
        options: {
          livereload: true
        },
        files: "**/*"
      }
    }
  });

  grunt.registerTask("default", ["connect:dev", "watch:dev"]);

}
