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
               SRC + 'core/**/*.js',
               SRC + 'ui/**/*.js',
               SRC + '_bootstrap.js'
            ],
            dest: BUILD + '<%= pkg.name %>.js',
            nonull: true
         }
      },
      copy: {
         main: {
            files: [
               { expand: true, cwd: 'src/main/', src: ['**/*.html'], dest: 'build', filter: 'isFile'},
               { expand: true, cwd: 'src/main/', src: ['**/*.css'], dest: 'build', filter: 'isFile'},
               { expand: true, cwd: 'src/main/', src: ['style/**/*'], dest: 'build'},
               { expand: true, src: ['ext/**/*'], dest: 'build'}
            ]
         }
      },
      clean: {
         build: ['build']
      },
      less: {
         options: {
            paths: ['src/main/style']
         },
         // target name
         src: {
            // no need for files, the config below should work
            expand: true,
            cwd:    'src/main/style',
            src:    '*.less',
            dest:   'src/main/style',
            ext:    '.less.css'
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-less');

   // Default task(s).
   grunt.registerTask('default', ['version', 'clean:build', 'concat', 'less', 'copy:main']);

   grunt.registerTask('version', 'Do something interesting.', function(arg) {
      var msg = 'version ' + grunt.config.get('pkg').version;
      grunt.log.writeln(msg);
   });
};
