/* global module:false */

/**
 * Gruntfile for yakjs-ui
 * @param grunt
 */
module.exports = function(grunt) {
    'use strict';

    var path = require('path');

    var pkg = grunt.file.readJSON('package.json');

    /**
     * Files
     */
    var currentDirectory = './';
    var buildDirectory = currentDirectory + '.build/';
    var distDirectory  = currentDirectory + '.dist/' + pkg.name + '/';
    var srcDirectory = currentDirectory + 'src/main/';

    /**
     * Build configuration
     */
    grunt.initConfig({
        pkg: pkg,
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: pkg.name + '.js',
                dest: pkg.name + '.min.js'
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
                    srcDirectory + '_namespaces.js',
                    srcDirectory + 'core/**/*.js',
                    srcDirectory + 'ui/**/*.js',
                    srcDirectory + '_bootstrap.js'
                ],
                dest: distDirectory + pkg.name + '.js',
                nonull: true
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: srcDirectory, src: ['**/*.*', '!**/*.less'], dest: distDirectory, filter: 'isFile'},
                    { expand: true, src: ['ext/**/*'], dest: distDirectory}
                ]
            },
            less: {
                files: [
                    { expand: true, cwd: srcDirectory, src: ['**/style/**.less'], dest: buildDirectory + 'less', filter: 'isFile'}
                ]
            }
        },
        clean: {
            all : [buildDirectory, distDirectory],
            build : [buildDirectory],
            dist : [distDirectory]
        },
        less: {
            options: {
                paths: [buildDirectory]
            },
            // target name
            src: {
                // no need for files, the config below should work
                expand: true,
                cwd:    buildDirectory + 'less/',
                src:    '**/*.less',
                dest:   distDirectory,
                ext:    '.css'
            }
        },
        watch: {
            less: {
                files: [srcDirectory + '**/*.less'],
                tasks: ['convertLess'],
                options: {
                    spawn: false
                }
            },
            script: {
                files: [srcDirectory + '**/*.js'],
                tasks: ['concat'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Single purpose Tasks
    grunt.registerTask('convertLess', ['copy:less', 'less']);

    // Development Mode. Watches for changes in *.js and *.less files to start assigned builds.
    grunt.registerTask('dev', ['build', 'watch']);

    // Build Tasks
    grunt.registerTask('build', ['clean:all', 'concat', 'copy:main', 'convertLess']);

    // Default task(s).
    grunt.registerTask('default', ['build']);
};
