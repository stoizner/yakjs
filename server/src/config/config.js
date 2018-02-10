'use strict';

/**
 * The YAKjs server configuration
 * @class
 */
class Config {
    /**
     * @constructor
     * @struct
     */
    constructor() {
        /**
         * The HTTP Port for YAKjs server. Default is 8790.
         * @type {number}
         */
        this.httpPort = 8790;

        /**
         * The folder location of the static frontend application.
         * @type {string}
         */
        this.frontendFolder = '../ui/dist/';

        /**
         * Whether to use secure connections for YAKjs and all WebSocket instances.
         * @type {boolean}
         */
        this.useSecureConnection = false;

        /**
         * @type {!Array<!StaticRouteConfig>}
         */
        this.staticRoutes = [];
    }
}

module.exports = Config;
