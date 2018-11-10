'use strict';

const fse = require('fs-extra');
const path = require('path');

/**
 * @type {string}
 */
const BLOB_DIR = path.join(__dirname, '../../blob/');

/**
 * @class
 */
class BlobProvider {
    /**
     * @param {string} space
     * @param {string} name
     * @param {!Buffer} data
     * @returns {!Promise}
     */
    write(space, name, data) {
        const spacePath = path.join(BLOB_DIR, space);
        const filePath = path.join(spacePath, name);

        return fse.ensureDir(spacePath).then(() => fse.outputFile(filePath, data, 'utf8'));
    }

    /**
     * @param {string} space
     * @param {string} name
     * @returns {!Promise<Buffer>}
     */
    read(space, name) {
        const spacePath = path.join(BLOB_DIR, space);
        const filePath = path.join(spacePath, name);

        return fse.readFile(filePath);
    }

    /**
     * @param {string} space
     * @param {string} name
     * @returns {!Promise<Buffer>}
     */
    delete(space, name) {
        const spacePath = path.join(BLOB_DIR, space);
        const filePath = path.join(spacePath, name);

        return fse.remove(filePath);
    }

    /**
     * @param {string} space
     * @returns {!Promise<Array<string>>}
     */
    getBlobs(space) {
        const spacePath = path.join(BLOB_DIR, space);

        return fse.readdir(spacePath);
    }

    /**
     * @returns {!Promise<Array<string>>}
     */
    getSpaces() {
        return fse.readdir(BLOB_DIR);
    }
}

module.exports = new BlobProvider();
