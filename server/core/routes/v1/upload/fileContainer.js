'use strict';

function FileContainer() {
    /**
     * @type {string}
     */
    this.filename = null;

    /**
     * UTF8 file content.
     * @type {string}
     */
    this.content = null;
}

module.exports = FileContainer;
