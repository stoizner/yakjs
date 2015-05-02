(function createStoreModule() {
    /**
     * YAK key-value store
     * @constructor
     */
    yak.Store = function Store() {

        /**
         * @type {yak.Store}
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
         * Filesystem
         */
        var fs = require('fs');

        /**
         * @type {!Object.<string, yak.StoreItem>}
         */
        var data = {};

        /**
         * Set a store value.
         * @param {string} key The document key.
         * @param {?} value The document
         */
        this.setValue = function setValue(key, value) {
            var item = data[key];

            if (!item) {
                item = new yak.StoreItem(key, value);
            } else {
                item.value = value;
            }

            data[key] = item;
            self.saveStoreItem(key);
        };

        /**
         * Get a store value
         * @param {string} key The document key.
         * @returns {*} The stored value.
         */
        this.getValue = function getValue(key) {
            return data[key].value;
        };

        /**
         * Get a complete store item.
         * @param {string} key
         * @returns {{key:string, value:?, description:string}} A store item.
         */
        this.getStoreItem = function getStoreItem(key) {
            return data[key];
        };

        /**
         * Delete value from store
         * @param {string} key
         * @returns {boolean} Whether it was successful.
         */
        this.deleteKey = function deleteKey(key) {
            var success = false;

            try {
                delete data[key];
                fs.unlinkSync(STORES_DIR + key + STORE_FILENAME_POSTFIX);
                success = true;
            } catch (ex) {
                throw new Error('Could not delete store file. (' + key + ')');
            }

            return success;
        };

        /**
         * Get the complete store
         * @returns {Array.<{key:string, value:?, description:?string}>} All store key/value items.
         */
        this.getStore = function getStore() {
            var store = [];
            _.each(data, function toStoreItem(item, key) {
                store.push({ key: key, value:item.value, description:item.description });
            });

            return store;
        };

        /**
         * Save store to file.
         */
        this.save = function save() {
            _.each(data, function toStoreItem(item) {
                self.saveStoreItem(item.key);
            });
        };

        /**
         * Save a store item
         * @param {string} key
         * @returns {boolean} success
         */
        this.saveStoreItem = function saveStoreItem(key) {
            var saved = false;

            try {
                if (_.has(data, key)) {
                    var filename = STORES_DIR + key + STORE_FILENAME_POSTFIX;
                    fs.writeFile(filename, data[key].value);
                }
                saved = true;
            } catch (ex) {
                throw new Error('Could not save store to file. (' + key + ')');
            }

            return saved;
        };

        /**
         * Load store from file.
         */
        this.load = function load() {
            var storeFileNames = getStoreFilenames();
            var storeFileContent = readStoreFiles(storeFileNames);

            data = {};
            _.each(storeFileContent, function toStoreItem(content, filename) {
                var key = filename.replace(STORE_FILENAME_POSTFIX, '');
                data[key] = new yak.StoreItem(key, content);
            });

        };

        /**
         * @param {!Array.<string>} filenames
         * @returns {!Object.<string, string>} Map with all file content.
         */
        function readStoreFiles(filenames) {
            var storeMap = {};

            _.each(filenames, function readFile(filename) {
                try {
                    var fileContent = fs.readFileSync(STORES_DIR + filename, {encoding: 'utf8'});

                    // Clean up windows line endings.
                    fileContent = fileContent.replace('\r\n', '\n');
                    storeMap[filename] = fileContent;
                } catch(ex) {
                    throw new Error('Could not read store file. ' + JSON.stringify({filename: filename, error: ex.message}));
                }
            });

            return storeMap;
        }

        /**
         * Search for plugin files in plugin directory.
         * @returns {!Array.<string>} List of plugin filenames found in the PLUGINS_DIR folder.
         */
        function getStoreFilenames() {
            var files =  fs.readdirSync(STORES_DIR);
            var filenames =  _.filter(files, function useFilesWithStorePostfix(filename) {
                return filename.lastIndexOf(STORE_FILENAME_POSTFIX) === (filename.length - STORE_FILENAME_POSTFIX.length);
            });

            return filenames;
        }
    };

    yak.exports.store = new yak.Store();
}());
