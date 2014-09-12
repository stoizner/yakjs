/* global module:false */

/**
 * Gruntfile for yakjs-server
 * @param grunt
 */
module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    var distDir = './dist/' ;
    var pkgDir = './dist/yakjs/';
    var serverComponentDir = pkgDir + 'server/';

    var serverDir = './server/';
    var serverSrcDir = serverDir + 'src/';

    var banner = ['/**',
            ' * ' + pkg.name,
            ' * @version ' + pkg.version,
            ' * @author ' + pkg.author,
            ' * @created ' + grunt.template.today('yyyy-mm-dd'),
            ' * @license ' + pkg.license,
        ' */\n'].join('\n');

    grunt.initConfig({
        pkg: pkg,
        clean: [distDir]
    });

    grunt.config.merge({
        uglify: {
            options: {
                banner: banner
            },
            build: {
                src: serverComponentDir + pkg.name + '.js',
                dest: serverComponentDir + pkg.name + '.min.js'
            }
        }
    });

    grunt.config.merge({
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
                        serverDir + '_namespaces.js',
                        serverSrcDir + '**/*.js',
                        serverDir + '_bootstrap.js'
                ],
                dest: serverComponentDir + pkg.name + '.js',
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
                        serverDir + '_namespaces.js',
                        serverSrcDir + 'api/**/*.js'
                ],
                dest: serverComponentDir + pkg.name + '.api.js',
                nonull: true
            }
        }
    });

    grunt.config.merge({
        copy: {
            server: {
                files: [
                    { flatten:true, src: ['README.md', 'LICENSE'], dest: serverComponentDir + '/' },
                    { flatten:false, src: ['node_modules/ws/**'], dest: serverComponentDir},
                    { flatten:false, src: ['node_modules/underscore/**'], dest: serverComponentDir},
                    { flatten:false, src: ['node_modules/npm/**'], dest: serverComponentDir},
                    { flatten:true, cwd: serverSrcDir + '/server/shell/', src: ['*.bat', '*.sh'], dest: serverComponentDir + '/', expand: true }
                ]
            },
            defaultPlugins : {
                files: [
                    { flatten:true, cwd: serverDir + 'plugins/', src: ['*.js'], dest: serverComponentDir + 'plugins/', expand: true }
                ]
            }
        }
    });

    grunt.config.merge({
        eslint: {
            options: {
                config: '.eslintrc'
            },
            server: [serverSrcDir + '**/*.js', '!' + serverSrcDir + '**/_module*.js']
        }
    });

    grunt.config.merge({
        watch: {
            server: {
                files: [serverDir + '**/*.js'],
                tasks: ['compile-server'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('compile-server', ['concat:server', 'concat:api', 'uglify']);
    grunt.registerTask('compile-ui', []);

    grunt.registerTask('build-server', ['compile-server', 'copy', 'eslint:server']);
    grunt.registerTask('build-ui', ['compile-ui']);

    grunt.registerTask('dev', ['compile', 'watch']);
    grunt.registerTask('compile', ['compile-server', 'compile-ui']);
    grunt.registerTask('build', ['clean', 'build-server', 'build-ui']);

    // TASK: default
    grunt.registerTask('default', ['build']);
};
