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
}

module.exports = ServerConfigItem;

