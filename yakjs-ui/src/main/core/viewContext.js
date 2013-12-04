/**
 * ViewContext
 * @class
 * @constructor
 */
yak.ui.ViewContext = function ViewContext() {
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

    /**
     * Constructor
     */
    function constructor() {
    }

    constructor();
};