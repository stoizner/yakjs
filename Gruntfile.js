/* global module:false */

const path = require('path');

/**
 * Gruntfile for yakjs
 * @param {?} grunt
 */
module.exports = function grunt(grunt) {
    'use strict';

    let pkg = grunt.file.readJSON('package.json');

    // Build Folder: for build related tasks
    let buildDir = './build/';

    // Default Folder: containing default YAKjs setup of instances, plugins and stores
    let defaultDir = './default/';

    // Server Folders: source code of the YAKjs server
    let serverDir = './server/';

    // User Interface Folders: source code of the YAKjs user interface
    let uiDir = './ui/';
    let uiSrcDir = uiDir + 'src/';

    // Test Folders: containing unit test and integration tests.
    let testDir = './test/';
    let testServerDir = testDir + 'server/';

    // Distribution Folder: intermediate and final output for the build process
    let distDir = './dist/';
    let tmpDir = distDir + 'tmp/';
    let pkgDir = './dist/yakjs/';
    let uiPkgDir = pkgDir + 'ui/';
    let reportsDir = distDir + 'reports/';
    let coverageDir = distDir + 'coverage/';

    let banner = ['/**',
            ' * ' + pkg.name,
            ' * @version ' + pkg.version,
            ' * @author ' + pkg.author,
            ' * @created ' + grunt.template.today('yyyy-mm-dd'),
            ' * @license ' + pkg.license,
        ' */\n\n'].join('\n');

    let appInfo = {
        version: pkg.version,
        created: (new Date()).toISOString()
    };

    let uiFooter = 'appVersion = ' + JSON.stringify(appInfo, null, 4) + ';';

    grunt.initConfig({
        pkg: pkg,
        clean: {
            dist: [distDir],
            tmp: [tmpDir]
        }
    });

    grunt.config.merge({
        uglify: {
            options: {
                banner: banner
            },
            build: {
                src: pkgDir + pkg.name + '.js',
                dest: pkgDir + pkg.name + '.min.js'
            }
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
            server: {
                files: [
                    {flatten: true, src: ['README.md', 'LICENSE', 'package.json'], dest: pkgDir},
                    {flatten: false, cwd: serverDir, src: ['yakjs.js'], dest: pkgDir, expand: true},
                    {flatten: false, cwd: serverDir, src: ['core/**/*'], dest: pkgDir, expand: true},
                    {flatten: false, cwd: serverDir, src: ['common/**/*'], dest: pkgDir, expand: true},
                    {flatten: false, cwd: serverDir, src: ['instances/**/*'], dest: pkgDir, expand: true},
                    {flatten: false, cwd: serverDir, src: ['modules/**/*'], dest: pkgDir, expand: true},
                    {flatten: false, cwd: serverDir, src: ['plugins/**/*'], dest: pkgDir, expand: true},
                    {flatten: false, cwd: serverDir, src: ['stores/**/*'], dest: pkgDir, expand: true},
                    {flatten: true, cwd: serverDir + 'bin/', src: ['*.bat', '*.sh'], dest: pkgDir, expand: true},
                    {flatten: true, cwd: serverDir + 'bin/', src: ['*.js'], dest: pkgDir + 'bin/', expand: true}
                ]
            },
            ui: {
                files: [
                    {expand: true, cwd: uiSrcDir, src: ['**/*.*', '!**/*.less', '!**/*.js', '!**/*.mustache'], dest: uiPkgDir, filter: 'isFile'},
                    {expand: true, cwd: uiDir, src: ['ext/**/*'], dest: uiPkgDir}
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
                dest:   uiPkgDir + 'style/',
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
                    target: uiPkgDir + 'index.html'
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
        compress: {
            zip: {
                options: {
                    archive: distDir + pkg.name + '-' + pkg.version + '.zip',
                    level: 9,
                    mode: 'zip',
                    pretty: true
                },
                files: [{
                    src: ['**/*'],
                    expand: true,
                    cwd: pkgDir,
                    dest: '.'
                }]
            }
        }
    });

    grunt.config.merge({
       exec: {
           installNodeModules: {
               cwd: './dist/yakjs/',
               command: 'npm install --production',
               stdout: true,
               stderr: true
           },

           npmPack: {
               cwd: './dist/yakjs/',
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
                    path: path.join(__dirname, uiPkgDir),
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
                    path: process.cwd() + distDir,
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

    grunt.registerTask('build-server', [
        'copy:server',
        'eslint:server']);
    grunt.registerTask('build-ui', ['compile-ui', 'clean:tmp']);

    grunt.registerTask('coverage', ['instrument', 'copy:coverageTest', 'mochaTest:coverage', 'storeCoverage', 'makeReport']);

    // Single runnable tasks
    grunt.registerTask('dev', ['build-server', 'build-ui', 'watch']);
    grunt.registerTask('compile', ['compile-ui']);
    grunt.registerTask('build', ['clean', 'mochaTest:unitTests', 'build-server', 'build-ui']);

    // Creates a releasable zip package
    grunt.registerTask('package', ['build', 'exec:installNodeModules', 'compress', 'exec:npmPack']);

    // TASK: default
    grunt.registerTask('default', ['build']);
};
