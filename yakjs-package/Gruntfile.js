/* global module:false */

module.exports = function(grunt) {
    'use strict';

    var PKG = grunt.file.readJSON('package.json');

    /**
     * Base Directories
     */
    var currentDirectory = './';
    var packageDistDirectory = currentDirectory + 'dist/' + PKG.name + '-' + PKG.version;
    var serverDistDirectory = '../yakjs-server/dist/yakjs-server/';
    var uiDistDirectory = '../yakjs-ui/dist/yakjs-ui/';

    // Project configuration.
    grunt.initConfig({
        pkg: PKG,
        clean: {
            release: [packageDistDirectory]
        },
        copy: {
            release: {
                files: [
                    { expand:true, flatten:false, cwd: serverDistDirectory, src: ['**'], dest: packageDistDirectory + '/yakjs-server/' },
                    { expand:true, flatten:false, cwd: uiDistDirectory, src: ['**'], dest: packageDistDirectory + '/yakjs-ui/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // TASK: default
    grunt.registerTask('default', ['version', 'clean', 'copy:release']);

    // TASK: mkDirRelease
    // Creates release directory.
    grunt.registerTask('mkDirRelease', [], function(arg) {
        // Create release directory
        grunt.file.mkdir(packageDistDirectory);
    });

    // TASK: version
    // Display current version to console
    grunt.registerTask('version', 'Do something interesting.', function(arg) {
        var msg = 'version ' + PKG.version;
        grunt.log.writeln(msg);
    });
};
