'use strict';

/* eslint-disable */

const through = require('through2');
const path = require('path');

/**
 * @returns {Object}
 */
function convertToHtmlTemplate() {
    return through.obj(function(file, encoding, callback) {
        callback(null, convert(file));
    });

    function convert(file) {
        let fileName = path.basename(file.path, '.mustache').toLowerCase();
        let mustacheTemplateString = file.contents.toString();

        let htmlTemplate = `
<script id="mustache-${fileName}" type="text/x-mustache-template">
 ${mustacheTemplateString}
</script>
`;
        file.contents = new Buffer.from(htmlTemplate);
        return file;
    }
}

module.exports = convertToHtmlTemplate;
