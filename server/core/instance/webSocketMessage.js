'use strict';

/**
 * @constructor
 * @struct
 * @param {Object|string|null} data
 */
function WebSocketMessage(data) {
    /**
     * @type {Object|string|null}
     */
    this.data = data || null;
}

module.exports = WebSocketMessage;
