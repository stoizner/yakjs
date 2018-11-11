'use strict';

/**
 * @class
 */
class Blob {
    /**
     * @param {string} name
     * @param {Buffer} content
     */
    constructor(name, content) {
        /**
         * @type {string}
         */
        this.name = name;

        /**
         * @type {Buffer|string}
         */
        this.content = content;
    }
}

module.exports = Blob;
