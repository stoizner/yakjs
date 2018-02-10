'use strict';

/**
 * @constructor
 * @static
 * @param {string} httpPort
 * @param {string} staticRoutesText
 */
function ServerConfigItem(httpPort, staticRoutesText) {
    /**
     * @type {string}
     */
    this.httpPort = httpPort;

    /**
     * @type {string}
     */
    this.staticRoutesText = staticRoutesText;

    /**
     * Whether to use secure connections for YAKjs and all WebSocket instances.
     * @type {boolean}
     */
    this.useSecureConnection = false;
}

module.exports = ServerConfigItem;

