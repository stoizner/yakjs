/* global module:false */

/**
 * Gruntfile for yakjs-server
 * @param grunt
 */
module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    /**
     * Base Directories
     */
    var currentDirectory = './';
    var buildDirectory = currentDirectory + 'build/';
    var tempDirectory = currentDirectory + 'dist/temp/';
    var distDirectory = currentDirectory + 'dist/' + pkg.name + '/';
    var srcDirectory = currentDirectory + 'src/main/';

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
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
                banner: '(c) ' + pkg.author,
                src: [
                    srcDirectory + '_namespaces.js',
                    srcDirectory + 'api/**/*.js',
                    srcDirectory + 'core/**/*.js',
                    srcDirectory + 'modules/**/*.js',
                    srcDirectory + 'plugins/**/*.js',
                    srcDirectory + 'service/**/*.js',
                    srcDirectory + '_bootstrap.js'
                ],
                dest: distDirectory + pkg.name + '.js',
                nonull: true
            }
        },
        copy: {
            dist: {
                files: [
                    { flatten:true, src: ['README.md', 'LICENSE', '*.bat', '*.sh'], dest: distDirectory + '/' },
                    { flatten:false, src: ['node_modules/ws/**'], dest: distDirectory},
                    { flatten:false, src: ['node_modules/underscore/**'], dest: distDirectory},
                    { flatten:false, src: ['node_modules/npm/**'], dest: distDirectory},
                    { flatten:true, cwd: srcDirectory + 'shell/', src: ['*.bat', '*.sh'], dest: distDirectory + '/', expand: true }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // TASK: mkDirRelease
    // Creates release directory.
    grunt.registerTask('mkDirRelease', ['version', 'concat'], function(arg) {
        // Create release directory
        grunt.file.mkdir(distDirectory + '/release');
    });

    // TASK: version
    // Display current version to console
    grunt.registerTask('version', 'Display current version', function(arg) {
        var msg = 'version ' + pkg.version;
        grunt.log.writeln(msg);
    });

    // TASK: default
    grunt.registerTask('default', ['version', 'concat', 'copy']);

};
