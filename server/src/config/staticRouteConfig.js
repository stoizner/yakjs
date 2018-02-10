'use strict';

/**
 * @class
 */
class StaticRouteConfig {
    /**
     * @constructor
     * @struct
     * @param {string} name
     * @param {string} path
     */
    constructor(name, path) {
        this.name = name;
        this.path = path;
    }
}

module.exports = StaticRouteConfig;
