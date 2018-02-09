/* global module:false */

const path = require('path');

/**
 * @param {?} grunt
 */
module.exports = function grunt(grunt) {
    'use strict';

    const pkg = grunt.file.readJSON('package.json');

    // Build Folder: for build related tasks
    const buildDir = './build/';

    // Server Folders: source code of the YAKjs server
    const serverDir = './server/';

    // User Interface Folders: source code of the YAKjs user interface
    const uiDir = './ui/';
    const uiSrcDir = uiDir + 'src/';

    // Test Folders: containing unit test and integration tests.
    const testDir = './test/';
    const testServerDir = testDir + 'server/';

    // Distribution Folder: intermediate and final output for the build process
    const tmpDir = './tmp/';
    const uiDistDir = './ui/dist/';
    const reportsDir = tmpDir + 'reports/';
    const coverageDir = tmpDir + 'coverage/';

    grunt.initConfig({
        pkg: pkg,
        clean: {
            uiDistDir: [uiDistDir],
            tmp: [tmpDir]
        }
    });

    grunt.config.merge({
        concat: {
            options: {
                separator: '\n'
            },
            less: {
                options: {},
                src: [
                        uiSrcDir + '**/*.less'
                ],
                dest: tmpDir + 'less/' + pkg.name + '-style.less',
                nonull: true
            }
        }
    });

    grunt.config.merge({
        copy: {
            ui: {
                files: [
                    {expand: true, cwd: uiSrcDir, src: ['**/*.*', '!**/*.less', '!**/*.js', '!**/*.mustache'], dest: uiDistDir, filter: 'isFile'},
                    {expand: true, cwd: uiDir, src: ['ext/**/*'], dest: uiDistDir}
                ]
            },
            coverageTest: {
                files: [
                    {flatten: true, cwd: serverDir, src: ['_namespaces.js'], dest: coverageDir + 'server/', expand: true},
                    {flatten: false, cwd: testServerDir, src: ['**/*.js'], dest: coverageDir + 'test/server/', expand: true},
                    {flatten: false, cwd: testDir, src: ['*.js'], dest: coverageDir + 'test/', expand: true}
                ]
            }
        }
    });

    grunt.config.merge({
        eslint: {
            options: {
                fix: true
            },
            server: [serverDir + '**/*.js']
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
            },
            client: {
                files: [uiDir + '**/*.*'],
                tasks: ['compile-ui'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.config.merge({
        less: {
            options: {
                paths: [tmpDir + 'less/']
            },
            src: {
                expand: true,
                cwd:    tmpDir + 'less/',
                src:    pkg.name + '-style.less',
                dest:   uiDistDir + 'style/',
                ext:    '.css'
            }
        }
    });

    grunt.config.merge({
        mustache: {
            dist: {
                files: {
                    src: [uiSrcDir + '**/*.mustache']
                },
                srcMerge: uiSrcDir + 'index.html',
                target: uiDistDir + 'index.html'
            }
        }
    });

    grunt.config.merge({
        mochaTest: {
            unitTests: {
                options: {
                    require: [],
                    reporter: 'spec'
                },
                src: ['./test/unitTests/**/*Test.js']
            },
            coverage: {
                options: {
                    reporter: 'spec'
                },
                src: [coverageDir + 'test/unitTests/**/*Test.js']
            },
            integration: {
                options: {
                    require: [],
                    reporter: 'spec'
                },
                src: ['./test/integration/**/*Test.js']
            }
        }
    });

    // Istanbul coverage analysis
    grunt.config.merge({
        instrument: {
            files: [serverDir + '**/*.js'],
                options: {
                basePath: coverageDir
            }
        }
    });

    grunt.config.merge({
        storeCoverage: {
            options: {
                dir: reportsDir + 'coverage-raw/'
            }
        }
    });

    grunt.config.merge({
        makeReport: {
            src: reportsDir + 'coverage-raw/**/*.json',
                options: {
                type: 'lcov',
                    dir: reportsDir + 'coverage/',
                    print: 'text-summary' // detail, none
            }
        }
    });

    grunt.config.merge({
       exec: {
           installNodeModules: {
               cwd: './',
               command: 'npm prune && npm install --production',
               stdout: true,
               stderr: true
           },

           npmPack: {
               cwd: './',
               command: 'npm pack',
               stdout: true,
               stderr: true
           }
       }
    });

    let webpackConsoleConfig = {
        // Configure the console output
        colors: false,
        modules: true,
        reasons: true
    };

    grunt.config.merge({
        webpack: {
            ui: {
                // webpack options
                entry: uiSrcDir + 'index.js',
                output: {
                    path: path.join(__dirname, uiDistDir),
                    filename: pkg.name + '-ui.js'
                },

                stats: webpackConsoleConfig,
                progress: true,
                failOnError: true
            },
            uiWatch: {
                // webpack options
                entry: uiSrcDir + 'index.js',
                output: {
                    path: process.cwd() + uiDistDir,
                    filename: pkg.name + '.js'
                },

                stats: {
                    // Configure the console output
                    colors: false,
                    modules: true,
                    reasons: true
                },

                progress: false,
                failOnError: false,
                watch: true,
                watchOptions: {
                    aggregateTimeout: 500,
                    poll: true
                }
            }
        }
    });

    // Load all npm tasks.
    require('load-grunt-tasks')(grunt);

    grunt.loadTasks(buildDir + 'grunt-tasks');

    grunt.registerTask('compile-ui', [
        'webpack:ui',
        'concat:less',
        'copy:ui',
        'less',
        'mustache'
    ]);

    grunt.registerTask('build-server', ['eslint:server']);
    grunt.registerTask('build-ui', ['compile-ui', 'clean:tmp']);

    grunt.registerTask('coverage', ['instrument', 'copy:coverageTest', 'mochaTest:coverage', 'storeCoverage', 'makeReport']);

    // Single runnable tasks
    grunt.registerTask('dev', ['build-server', 'build-ui', 'watch']);
    grunt.registerTask('compile', ['compile-ui']);
    grunt.registerTask('build', ['clean', 'mochaTest:unitTests', 'build-server', 'build-ui']);

    // Creates a releasable zip package
    grunt.registerTask('package', ['build', 'exec:installNodeModules', 'exec:npmPack']);

    // TASK: default
    grunt.registerTask('default', ['build']);
};
