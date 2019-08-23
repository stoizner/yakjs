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
        this.frontendFolder = '../../node_modules/@yakjs/yakjs-client/dist';

        /**
         * @type {!Array<!StaticRouteConfig>}
         */
        this.staticRoutes = [];
    }
}

module.exports = Config;
