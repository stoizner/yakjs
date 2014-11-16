/**
 * ViewContext
 * @constructor
 */
yak.ui.ViewContext = function ViewContext() {
    'use strict';

    /**
     * @type {yak.ui.ViewFactory}
     */
    this.viewFactory = null;

    /**
     * @type {yak.ui.TemplateLoader}
     */
    this.template = null;

    /**
     * @type {{observable:function, applyBindings:function}}
     */
    this.ko = null;
};