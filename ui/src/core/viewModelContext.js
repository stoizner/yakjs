/**
 * ViewModelContext
 * @constructor
 */
yak.ui.ViewModelContext = function ViewModelContext() {
    'use strict';

    /**
     * @type {yak.ui.ViewContext}
     */
    var self = this;

    /**
     * @type {yak.ui.HttpAdapter}
     */
    this.adapter = null;

    /**
     * @type {cobu.EventBus}
     */
    this.eventBus = null;
};