'use strict';

/**
 * @public
 * @constructor
 * @struct
 * @param {string} message
 * @param {Error|?} originalError
 */
function JsonStore(message, originalError) {
    /**
     * @type {string}
     */
    this.message = message;

    /**
     * @type {Error|?}
     */
    this.originalError = originalError;
}

module.exports = JsonStore;
