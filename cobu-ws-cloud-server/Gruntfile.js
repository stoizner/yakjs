//noinspection JSUnresolvedVariable
module.exports = function(grunt) {

    'use strict';

    var PKG = grunt.file.readJSON('package.json');

    var BUILD = 'build/';
    var SRC = 'src/main/';

    // Project configuration.
    grunt.initConfig({
        pkg: PKG,
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
                dest: BUILD + PKG.name + '.js',
                nonull: true
            }
        },
        copy: {
            readme: {
                files: [
                    { flatten:true, src: ['README.md'], dest: BUILD + '/' },
                    { flatten:true, src: ['LICENSE'], dest: BUILD + '/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // TASK: default
    grunt.registerTask('default', ['version', 'concat', 'copy:readme']);

    // TASK: mkDirRelease
    // Creates release directory.
    grunt.registerTask('mkDirRelease', ['version', 'concat'], function(arg) {
        // Create release directory
        grunt.file.mkdir(BUILD + '/release');
    });

    // TASK: version
    // Display current version to console
    grunt.registerTask('version', 'Do something interesting.', function(arg) {
        var msg = 'version ' + PKG.version;
        grunt.log.writeln(msg);
    });
};
