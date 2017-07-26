var httpAdapter = require('./httpAdapter/httpAdapter');
var VersionChecker = require('./versionChecker');

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

    /**
     * @type {!VersionChecker}
     */
    this.versionChecker = new VersionChecker();
}

module.exports = ViewModelContext;
