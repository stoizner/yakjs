/**
 * @constructor
 */
yak.StoreProvider = function StoreProvider() {
    'use strict';

    var fs = require('fs');

    /**
     * @type {!yak.StoreProvider}
     */
    var self = this;

    /**
     * @type {string}
     */
    var STORES_DIR = './stores/';

    /**
     * @type {string}
     */
    var STORE_FILENAME_POSTFIX = '.store.txt';

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {!Object<string, !yak.StoreKeyValueItem>}
     */
    var storeCache = {};

    /**
     * Loads all store data files into the store cache.
     */
    this.load = function load() {
        var storeFileNames = getStoreDataFilenames();
        var storeFileContent = readStoreDataFiles(storeFileNames);

        storeCache = {};

        storeFileContent.forEach(function addToCache(fileItem) {
            var key = fileItem.filename.replace(STORE_FILENAME_POSTFIX, '');
            storeCache[key] = new yak.StoreKeyValueItem(key, fileItem.content);
        });

        log.debug('Store data loaded.', {keys: Object.keys(storeCache)});
    };

    /**
     * Gets the complete cached store.
     * @returns {!Array<!yak.StoreKeyValueItem>} The store as list of key value items.
     */
    this.getStore = function getStore() {
        return Object.keys(storeCache).map((key) => {
            return new yak.StoreKeyValueItem(key, storeCache[key].value);
        });
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
    this.updateValue = function updateValue(key, value) {
        var success = false;

        try {
            var filename = STORES_DIR + key + STORE_FILENAME_POSTFIX;
            fs.writeFileSync(filename, value);
            storeCache[key] = new yak.StoreKeyValueItem(key, value);
            success = true;
        } catch (ex) {
            log.warn('Could not save data store file.', {key: keyValueItem.key});
        }

        return success;
    };

    /**
     * Deletes a key and its value from the store.
     * @param {string} key
     * @returns {boolean} success
     */
    this.deleteValue = function deleteValue(key) {
        var success = false;

        try {
            fs.unlinkSync(STORES_DIR + key + STORE_FILENAME_POSTFIX);
            delete storeCache[key];
            success = true;
        } catch (ex) {
            log.warn('Could not delete store file.', {key: keyValueItem.key});
        }

        return success;
    };

    /**
     * @param {!Array<string>} filenames
     * @returns {!Array<{filename: string, content: string}>} All file content.
     */
    function readStoreDataFiles(filenames) {
        return filenames.map(function readFile(filename) {
            try {
                var content = fs.readFileSync(STORES_DIR + filename, {encoding: 'utf8'});

                // Clean up windows line endings.
                content = content.replace('\r\n', '\n');

                return {
                    filename: filename,
                    content: content
                };
            } catch(ex) {
               log.error('Could not read store data file. ', {filename: filename, error: ex.message});
            }
        });
    }

    /**
     * Gets List of store data filenames found in the STORES_DIR folder.
     * @returns {!Array<string>} List of store data filenames found in the STORES_DIR folder.
     */
    function getStoreDataFilenames() {
        var files =  fs.readdirSync(STORES_DIR);

        return files.filter(function useFilesWithStorePostfix(filename) {
            return filename.lastIndexOf(STORE_FILENAME_POSTFIX) === (filename.length - STORE_FILENAME_POSTFIX.length);
        });
    }

};
