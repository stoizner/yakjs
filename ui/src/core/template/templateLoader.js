/**
 * TemplateLoader
 * @constructor
 * @param {Mustache} mustache
 */
yak.ui.TemplateLoader = function TemplateLoader(mustache) {
    'use strict';

    /**
     * Load a template by Name
     * @param {string} templateName
     */
    this.load = function load(templateName) {
        var templateId = 'mustache-' + templateName.toLowerCase();
        var templateElement = $('#' + templateId);

        if (!templateElement.length) {
            throw new Error('TemplateLoader: Can not find template [' + templateName + '] width id [' + templateId + ']');
        }

        var templateRaw = templateElement.html();
        Mustache.parse(templateRaw);

        return new yak.ui.Template(templateRaw);
    };
};