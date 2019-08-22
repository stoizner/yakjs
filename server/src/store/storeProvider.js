'use strict';

const fs = require('fs');
const path = require('path');
const log = require('../infrastructure/logger').defaultLogger;
const StoreKeyValueItem = require('./storeKeyValueItem');
const fileExtension = require('../infrastructure/fileExtension');

/**
 * @constructor
 * @struct
 */
function StoreProvider() {
    /**
     * @type {!StoreProvider}
     */
    const self = this;

    /**
     * @type {string}
     */
    const STORES_DIR = path.join(__dirname, '../../stores/');

    /**
     * @type {string}
     */
    const STORE_FILENAME_POSTFIX = '.store.txt';

    /**
     * @type {!Object<string, !StoreKeyValueItem>}
     */
    let storeCache = {};

    /**
     * Loads all store data files into the store cache.
     */
    this.load = function load() {
        let storeFileNames = getStoreDataFilenames();
        let storeFileContent = readStoreDataFiles(storeFileNames);

        storeCache = {};

        storeFileContent.forEach(function addToCache(fileItem) {
            let key = fileItem.filename.replace(STORE_FILENAME_POSTFIX, '');
            storeCache[key] = new StoreKeyValueItem(key, fileItem.content);
        });

        log.debug('Store data loaded.', {keys: Object.keys(storeCache)});
    };

    /**
     * Gets the complete cached store.
     * @returns {!Array<!StoreKeyValueItem>} The store as list of key value items.
     */
    this.getStoreItems = function getStoreItems() {
        return Object.keys(storeCache).map(key => new StoreKeyValueItem(key, storeCache[key].value));
    };

    /**
     * Gets a value from the cached store.
     * @param {string} key The unique key.
     * @returns {string} The value.
     */
    this.getValue = function getValue(key) {
        return storeCache[key] ? storeCache[key].value : null;
    };

    /**
     * Whether there is a value for the given key.
     * @param {string} key The unique key.
     * @returns {boolean} Whether there is a value or not.
     */
    this.hasValue = function hasValue(key) {
        return storeCache.hasOwnProperty(key);
    };

    /**
     * Creates or updates a store key value item.
     * @param {string} key The unique key.
     * @param {string} value The value.
     * @returns {boolean} success
     */
    this.updateItem = function updateItem(key, value) {
        let success = false;

        try {
            let filename = STORES_DIR + key + STORE_FILENAME_POSTFIX;
            fs.writeFileSync(filename, value);
            storeCache[key] = new StoreKeyValueItem(key, value);
            success = true;
        } catch (ex) {
            log.warn('Could not save data store file.', {key: key});
        }

        return success;
    };

    /**
     * Deletes a key and its value from the store.
     * @param {string} key
     * @returns {boolean} success
     */
    this.deleteItem = function deleteItem(key) {
        let success = false;

        try {
            fs.unlinkSync(STORES_DIR + key + STORE_FILENAME_POSTFIX);
            delete storeCache[key];
            success = true;
        } catch (ex) {
            log.warn('Could not delete store file.', {key: key});
        }

        return success;
    };

    /**
     * @param {!FileContainer} fileContainer
     * @returns {!Promise}
     */
    this.upload = function upload(fileContainer) {
        return new Promise((resolve, reject) => {
            let documentKey = fileContainer.filename.replace(fileExtension.STORE_EXTENSION, '');
            documentKey = documentKey.replace(fileExtension.STORE_EXTENSION_OLD, '');

            if (self.updateItem(documentKey, fileContainer.content)) {
                resolve();
            } else {
                reject('Update store item failed unexpected.');
            }
        });
    };

    /**
     * @param {!Array<string>} filenames
     * @returns {!Array<{filename: string, content: string}>} All file content.
     */
    function readStoreDataFiles(filenames) {
        return filenames.map(function readFile(filename) {
            let content = null;

            try {
                content = fs.readFileSync(STORES_DIR + filename, {encoding: 'utf8'});

                // Clean up windows line endings.
                content = content.replace('\r\n', '\n');
            } catch (ex) {
                log.error('Could not read store data file. ', {filename: filename, error: ex.message});
            }

            return {
                filename: filename,
                content: content
            };
        });
    }

    /**
     * Gets List of store data filenames found in the STORES_DIR folder.
     * @returns {!Array<string>} List of store data filenames found in the STORES_DIR folder.
     */
    function getStoreDataFilenames() {
        let files = fs.readdirSync(STORES_DIR);

        return files.filter(function useFilesWithStorePostfix(filename) {
            return filename.lastIndexOf(STORE_FILENAME_POSTFIX) === (filename.length - STORE_FILENAME_POSTFIX.length);
        });
    }
}

module.exports = new StoreProvider();
