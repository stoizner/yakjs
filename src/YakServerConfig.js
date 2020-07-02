'use strict';

import {ConsoleLogger} from '../log/ConsoleLogger.js';

/**
 * The YAKjs server configuration
 * @class
 */
export class YakServerConfig {
    /**
     * @constructor
     * @struct
     */
    constructor() {
        /**
         * The HTTP Port for YAKjs server. Default is 8790.
         * @type {number}
         */
        this.port = 8790;

        /**
         * @type {YakLogger}
         */
        this.log = new ConsoleLogger();

        /**
         * @type {boolean}
         */
        this.useSecureConnection = false;

        /**
         * @type {string}
         */
        this.frontendFolder = './frontend/static/';
    }
}
