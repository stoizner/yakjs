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
            src: [
               SRC + '_namespaces.js',
               SRC + 'service/**/*.js'
            ],
            dest: BUILD + '<%= pkg.name %>.js',
            nonull: true
         }
      },
      copy: {
         toServer: {
            files: [
               { expand: true, cwd: 'build/', src: ['*.js'], dest: '../cobu-ws-cloud-server/src/main/api', filter: 'isFile'},
               { expand: true, cwd: 'build/', src: ['*.js'], dest: '../cobu-ws-cloud-ui/ext', filter: 'isFile'}
            ]
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-copy');

   // Default task(s).
   grunt.registerTask('default', ['version', 'concat', 'copy:toServer']);

   grunt.registerTask('version', 'Do something interesting.', function(arg) {
      var msg = 'version ' + grunt.config.get('pkg').version;
      grunt.log.writeln(msg);
   });
};
