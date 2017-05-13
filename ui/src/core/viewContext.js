/**
 * @constructor
 * @struct
 */
function ViewContext() {
    'use strict';

    /**
     * @type {ViewFactory}
     */
    this.viewFactory = null;

    /**
     * @type {TemplateLoader}
     */
    this.template = null;
}

module.exports = ViewContext;
