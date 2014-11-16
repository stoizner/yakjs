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
     * @type {yak.ui.WebSocketAdapter}
     */
    this.webSocket = null;

    /**
     * @type {cobu.EventBus}
     */
    this.eventBus = null;
};