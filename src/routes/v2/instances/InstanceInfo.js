/**
 * @constructor
 * @struct
 */
export class InstanceInfo {
    constructor() {
        /**
         * ID of the instance
         * @type {string}
         */
        this.id = null;

        /**
         * Name of the instance
         * @type {string}
         */
        this.name = null;

        /**
         * Instance state
         * @type {string}
         */
        this.state = null;

        /**
         * Description
         * @type {?string}
         */
        this.description = null;

        /**
         * Number of current active connections
         * @type {number}
         */
        this.connectionCount = 0;

        /**
         * @type {number}
         */
        this.port = null;

        /**
         * @type {Array<string>}
         */
        this.plugins = [];
    }
}
