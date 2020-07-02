'use strict';

import Blob from './blob';
import fse from 'fs-extra';
import path from 'path';

/**
 * @type {string}
 */
const BLOB_DIR = path.join(__dirname, '../../blob/');

/**
 * @class
 */
export class BlobProvider {
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
     * @returns {!Promise<Blob>}
     */
    read(space, name) {
        const spacePath = path.join(BLOB_DIR, space);
        const filePath = path.join(spacePath, name);
        let blobName = name;

        return fse.stat(filePath)
            .then(() => fse.readFile(filePath))
            .catch(error => {
                // The file does not exist.
                // Start a lookup if a file with the given name and any extension does exist.
                return this.getBlobs(space).then(blobNames => {
                    let promise;
                    const bobNameMap = blobNames.reduce((index, currentBlobName) => {
                        const blobNameWithoutExtension = path.basename(currentBlobName, path.extname(currentBlobName));
                        return Object.assign(index, {[blobNameWithoutExtension]: currentBlobName});
                    }, {});

                    if (bobNameMap[name]) {
                        blobName = bobNameMap[name];
                        const filePathWithExtension = path.join(spacePath, blobName);
                        promise = fse.readFile(filePathWithExtension);
                    } else {
                        promise = Promise.reject(error);
                    }

                    return promise;
                });
            })
            .then(content => {
                return new Blob(blobName, content);
            });
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
