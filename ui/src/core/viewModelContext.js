var httpAdapter = require('./httpAdapter/httpAdapter');

/**
 * @constructor
 * @struct
 */
function ViewModelContext(eventBus) {
    'use strict';

    /**
     * @type {!HttpAdapter}
     */
    this.adapter = httpAdapter;

    /**
     * @type {!cobu.EventBus}
     */
    this.eventBus = eventBus;
}

module.exports = ViewModelContext;
