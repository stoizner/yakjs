//noinspection JSUnresolvedVariable
module.exports = function(grunt) {

    'use strict';

    var PKG = grunt.file.readJSON('package.json');

    var DST_RELEASE = 'release/' + PKG.name + '-' + PKG.version;
    var SRC_SERVER = '../yakjs-server/build/';
    var SRC_UI = '../yakjs-ui/build/';

    // Project configuration.
    grunt.initConfig({
        pkg: PKG,
        clean: {
            release: [DST_RELEASE]
        },
        copy: {
            release: {
                files: [
                    { expand:true, flatten:false, cwd: SRC_SERVER, src: ['**'], dest: DST_RELEASE + '/yakjs-server/' },
                    { expand:true, flatten:false, cwd: SRC_UI, src: ['**'], dest: DST_RELEASE + '/yakjs-ui/'}
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
        grunt.file.mkdir(DST_RELEASE);
    });

    // TASK: version
    // Display current version to console
    grunt.registerTask('version', 'Do something interesting.', function(arg) {
        var msg = 'version ' + PKG.version;
        grunt.log.writeln(msg);
    });
};
