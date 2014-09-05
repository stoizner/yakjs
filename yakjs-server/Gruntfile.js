/* global module:false */

/**
 * Gruntfile for yakjs-server
 * @param grunt
 */
module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    var distDirectory = './dist/';
    var pkgDirectory = './dist/';
    var srcDirectory = './src/';
    var libDirectory = srcDirectory + 'lib/';

    var banner = ['/**',
            ' * ' + pkg.name,
            ' * @version ' + pkg.version,
            ' * @author ' + pkg.author,
            ' * @created ' + grunt.template.today('yyyy-mm-dd'),
            ' * @license ' + pkg.license,
        ' */\n'].join('\n');

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,

        clean: [pkgDirectory],

        uglify: {
            options: {
                banner: banner
            },
            build: {
                src: pkgDirectory + pkg.name + '.js',
                dest: pkgDirectory + pkg.name + '.min.js'
            }
        },

        concat: {
            options: {
                separator: '\n'
            },
            server: {
                options: {
                    process: function(src, filepath) {
                        // grunt.log.writeln(filepath);
                        return src;
                    }
                },
                banner: '(c) ' + pkg.author,
                src: [
                    srcDirectory + '_namespaces.js',
                    srcDirectory + 'api/**/*.js',
                    srcDirectory + 'server/**/*.js',
                    srcDirectory + '_bootstrap.js'
                ],
                dest: distDirectory + pkg.name + '.js',
                nonull: true
            },
            api: {
                options: {
                    process: function(src, filepath) {
                        // grunt.log.writeln(filepath);
                        return src;
                    }
                },
                banner: '(c) ' + pkg.author,
                src: [
                    srcDirectory + '_namespaces.js',
                    srcDirectory + 'api/**/*.js'
                ],
                dest: distDirectory + pkg.name + '.api.js',
                nonull: true
            }
        },

        copy: {
            dist: {
                files: [
                    { flatten:true, src: ['README.md', 'LICENSE'], dest: distDirectory + '/' },
                    { flatten:false, src: ['node_modules/ws/**'], dest: distDirectory},
                    { flatten:false, src: ['node_modules/underscore/**'], dest: distDirectory},
                    { flatten:false, src: ['node_modules/npm/**'], dest: distDirectory},
                    { flatten:true, cwd: srcDirectory + '/server/shell/', src: ['*.bat', '*.sh'], dest: distDirectory + '/', expand: true }
                ]
            }
        },

        eslint: {
            options: {
                config: '.eslintrc'
            },
            target: [srcDirectory + '**/*.js', '!' + srcDirectory + '**/_module*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.registerTask('compile', ['clean', 'concat:server', 'concat:api', 'copy', 'uglify']);
    grunt.registerTask('build', ['compile', 'eslint']);
    grunt.registerTask('release', ['build', 'compress']);

    // TASK: default
    grunt.registerTask('default', ['build']);
};
