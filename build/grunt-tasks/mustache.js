/* global module:false, grunt:false */

module.exports = function(grunt) {

    'use strict';

    var path = require('path');

    grunt.registerMultiTask('mustache', 'Collect mustache templates and replace {{{{mustache-templates-all}}}} in index.html', function() {

        /**
         * @type {{ files: { src: [] }, srcMerge: string, dest: string }}
         */
        var taskConfig = this.data;
        var allTemplatesAsScripts = '';

        grunt.log.writeln(JSON.stringify( this.files));

        this.files.forEach(function(file) {
            file.src.forEach(function(sourceFileName) {
                grunt.log.writeln(JSON.stringify(sourceFileName));
                allTemplatesAsScripts += getTemplate(sourceFileName);
            });
        });

        writeToTarget(allTemplatesAsScripts, taskConfig.srcMerge, taskConfig.target);
    });

    /**
     * Get the mustache template as a string wrapped in script tag. The name(script id) of the template is mustache-[fileName].
     * @param {string} pathMustache The full path to the mustache template file.
     * @return {string} The template string.
     */
    function getTemplate(pathMustache) {
        var templateRaw = grunt.file.read(pathMustache);
        var templateId = getTemplateId(pathMustache);

        return '\n<script id="mustache-' + templateId +'" type="text/x-mustache-template">\n' + templateRaw + '\n</script>\n';
    }

    /**
     * Write template content to target file's placeholder ({{mustache-templates-all}})
     * @param allTemplatesAsScripts
     * @param mergeSrcFile The file to read and look for the placeholder.
     * @param destinationFile The file to write the merged content.
     */
    function writeToTarget(allTemplatesAsScripts, mergeSrcFile, destinationFile) {
        var targetContent = grunt.file.read(mergeSrcFile);

        targetContent = targetContent.replace('{{mustache-templates-all}}', allTemplatesAsScripts);

        grunt.file.write(destinationFile, targetContent);
    }

    /**
     *
     * @param fileName
     * @returns {string}
     */
    function getTemplateId(fileName) {
        return path.basename(fileName, '.mustache').toLowerCase();
    }
};