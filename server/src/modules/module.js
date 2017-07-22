'use strict';

/**
 * @constructor
 * @struct
 */
function Module() {
    /**
     * The unique name of the module, it is equal to the filename in folder modules.
     * @type {string}
     */
    this.name = null;

    /**
     * @type {string}
     */
    this.content = null;
}

module.exports = Module;
