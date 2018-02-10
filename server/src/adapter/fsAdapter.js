'use strict';

const fs = require('fs');
const promisify = require('util.promisify');

const writeFile = promisify(fs.writeFile);

const JSON_SPACES = 4;

/**
 * @class
 */
class FsAdapter {
    /**
     * @param {string} file
     * @param {!Object} obj
     * @returns {!Promise}
     */
    writeJsonFile(file, obj) {
        return writeFile(file, JSON.stringify(obj, null, JSON_SPACES), 'utf8');
    }
}

module.exports = new FsAdapter();
