'use strict';

/**
 * The YAKjs server configuration
 * @constructor
 * @struct
 */
function Config() {
    /**
     * The HTTP Port for YAKjs server. Default is 8790.
     * @type {number}
     */
    this.httpPort = 8790;

    /**
     * The folder location of the static frontend application.
     * @type {string}
     */
    this.frontendFolder = './ui/';
}

module.exports = Config;
