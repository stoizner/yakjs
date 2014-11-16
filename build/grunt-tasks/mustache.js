/* global module:false, grunt:false */

module.exports = function mustache(grunt) {
    'use strict';

    var path = require('path');

    grunt.registerMultiTask('mustache', 'Collect mustache templates and replace {{{{mustache-templates-all}}}} in index.html', function task() {

        /**
         * @type {{ files: { src: [] }, srcMerge: string, dest: string }}
         */
        var taskConfig = this.data;
        var allTemplatesAsScripts = '';

        // grunt.log.writeln(JSON.stringify( this.files));

        var templateCount = 0;
        this.files.forEach(function forFile(file) {
            file.src.forEach(function forSource(sourceFileName) {
                // grunt.log.writeln(JSON.stringify(sourceFileName));
                allTemplatesAsScripts += getTemplate(sourceFileName);
                templateCount++;
            });
        });

        grunt.log.writeln(templateCount + ' Mustache template(s) found.');

        writeToTarget(allTemplatesAsScripts, taskConfig.srcMerge, taskConfig.target);
    });

    /**
     * Get the mustache template as a string wrapped in script tag. The name(script id) of the template is mustache-[fileName].
     * @param {string} pathMustache The full path to the mustache template file.
     * @returns {string} The template string.
     */
    function getTemplate(pathMustache) {
        var templateRaw = grunt.file.read(pathMustache);
        var templateId = getTemplateId(pathMustache);

        return '\n<script id="mustache-' + templateId + '" type="text/x-mustache-template">\n' + templateRaw + '\n</script>\n';
    }

    /**
     * Write template content to target file's placeholder ({{mustache-templates-all}})
     * @param {string} allTemplatesAsScripts
     * @param {Array} mergeSrcFile The file to read and look for the placeholder.
     * @param {string} destinationFile The file to write the merged content.
     */
    function writeToTarget(allTemplatesAsScripts, mergeSrcFile, destinationFile) {
        var targetContent = grunt.file.read(mergeSrcFile);

        targetContent = targetContent.replace('{{mustache-templates-all}}', allTemplatesAsScripts);

        grunt.file.write(destinationFile, targetContent);
    }

    /**
     * @param {string} fileName
     * @returns {string} The unique template id.
     */
    function getTemplateId(fileName) {
        return path.basename(fileName, '.mustache').toLowerCase();
    }
};
