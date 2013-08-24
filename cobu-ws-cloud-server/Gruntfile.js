module.exports = function(grunt) {

   var BUILD = "build/";
   var SRC = "src/main/";

   // Project configuration.
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
         options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
         },
         build: {
            src: '<%= pkg.name %>.js',
            dest: '<%= pkg.name %>.min.js'
         }
      },
      concat: {
         options: {
            separator: ''
         },
         dist: {
            options: {
               process: function(src, filepath) {
                  grunt.log.writeln(filepath);
                  return src;
               }
            },
            banner: '(c) Christian Schuller',
            src: [
               SRC + '_namespaces.js',
               SRC + 'api/**/*.js',
               SRC + 'core/**/*.js',
               SRC + 'modules/**/*.js',
               SRC + 'plugins/**/*.js',
               SRC + 'service/**/*.js',
               SRC + '_bootstrap.js'
            ],
            dest: BUILD + '<%= pkg.name %>.js',
            nonull: true
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-concat');

   // Default task(s).
   grunt.registerTask('default', ['version', 'concat']);

   grunt.registerTask('version', 'Do something interesting.', function(arg) {
      var msg = 'version ' + grunt.config.get('pkg').version;
      grunt.log.writeln(msg);
   });
};
