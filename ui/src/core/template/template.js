/**
 * TemplateEngine
 * @class
 * @constructor
 */
yak.ui.Template = function Template(template) {
    'use strict';

    /**
     * Build
     * @param [view] A view object that contains the data and code needed to render the template.
     */
    this.build = function build(view) {
        return Mustache.render(template, view);
    };
};