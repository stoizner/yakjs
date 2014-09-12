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
     * Base Directories
     */
    var currentDirectory = './';
    var buildDirectory = currentDirectory + 'build/';
    var tempDirectory = currentDirectory + 'dist/temp/';
    var distDirectory  = currentDirectory + 'dist/' + pkg.name + '/';
    var srcDirectory = currentDirectory + 'src/main/';

    var banner = '/* ' + pkg.name + ' version: ' + pkg.version + ' created: ' + grunt.template.today('yyyy-mm-dd') + '*/\n\n';
    var footer = 'yak.ui.version = \'' + pkg.version + '\';\n';

    /**
     * Build configuration
     */
    grunt.initConfig({
        pkg: pkg,
        uglify: {
            options: {
                banner: banner,
                footer: footer
            },
            build: {
                src: pkg.name + '.js',
                dest: pkg.name + '.min.js'
            }
        },
        concat: {
            options: {
                separator: '\n',
                banner: banner,
                footer: footer
            },
            dist: {
                options: {
                    process: function(src, filepath) {
                        grunt.log.writeln(filepath);
                        return src;
                    }
                },
                banner: banner,
                footer: footer,
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
                    { expand: true, cwd: srcDirectory, src: ['**/*.*', '!**/*.less', '!**/*.js', '!**/*.mustache'], dest: distDirectory, filter: 'isFile'},
                    { expand: true, src: ['ext/**/*'], dest: distDirectory}
                ]
            },
            less: {
                files: [
                    { expand: true, cwd: srcDirectory, src: ['**/style/**.less'], dest: tempDirectory + 'less', filter: 'isFile'}
                ]
            }
        },
        clean: {
            all : [tempDirectory, distDirectory],
            build : [tempDirectory],
            dist : [distDirectory]
        },
        less: {
            options: {
                paths: [tempDirectory]
            },
            // target name
            src: {
                // no need for files, the config below should work
                expand: true,
                cwd:    tempDirectory + 'less/',
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
            },
            css : {
                files: [srcDirectory + '**/*.css'],
                tasks: ['copy:main'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            },
            index: {
                files: [srcDirectory + 'index.html'],
                tasks: ['build'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            },
            mustache: {
                files: [srcDirectory + '**/*.mustache'],
                tasks: ['mustache'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        },
        mustache: {
            dist: {
                files: {
                    src: [srcDirectory + '**/*.mustache']
                },
                srcMerge: srcDirectory + 'index.html',
                target: distDirectory + 'index.html'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadTasks(buildDirectory + 'grunt-tasks');

    // Single purpose Tasks
    grunt.registerTask('convertLess', ['copy:less', 'less']);

    // Development Mode. Watches for changes in *.js and *.less files to start assigned builds.
    grunt.registerTask('dev', ['build', 'watch']);

    // Build Tasks
    grunt.registerTask('build', ['clean:all', 'concat', 'copy:main', 'convertLess', 'mustache']);

    // Default task(s).
    grunt.registerTask('default', ['build']);
};
