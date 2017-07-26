'use strict';

var TemplateLoader = require('./templateLoader');

/**
 * @type {!TemplateLoader}
 */
var templateLoader = new TemplateLoader(Mustache);

/**
 * @param {string} templateName
 * @returns {!Template}
 */
function loadTemplate(templateName) {
    return templateLoader.load(templateName);
}

module.exports = loadTemplate;
