(function() {
    'use strict';

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
         * Store file name.
         * @type {string}
         */
        var STORE_FILENAME = 'store.json';

        /**
         * Filesystem
         */
        var fs = require('fs');

        /**
         * @type {yak.Logger}
         */
        var log = new yak.Logger(self.constructor.name);

        /**
         * @type {Object.<string, ?>}
         */
        var data = {};

        /**
         * Set a store value.
         * @param key
         * @param value
         * @param [description]
         */
        this.setValue = function setValue(key, value, description) {

            var item = data[key];

            if (!item) {
                item = {};
            }

            if (value) {
                item.value = value;
            }

            if (description) {
                item.description = description;
            }

            data[key] = item;
            self.save();
        };

        /**
         * Get a store value
         * @param {string} key
         * @returns {*}
         */
        this.getValue = function getValue(key) {
            return data[key].value;
        };

        /**
         * Get a complete store item.
         * @param {string} key
         * @returns {{key:string, value:?}}
         */
        this.getStoreItem = function getStoreItem(key) {
            return data[key];
        };

        /**
         * Delete value from store
         * @param {string} key
         * @return {boolean}
         */
        this.deleteKey = function deleteKey(key) {
            return delete data[key];
        };

        /**
         * Get the complete store
         * @returns {Array.<{key:string, value:?, description:?string}>}
         */
        this.getStore = function getStore() {

            var store = [];
            _.each(data, function(item, key) {
                store.push({ key: key, value:item.value, description:item.description });
            });

            return store;
        };

        /**
         * Save store to file.
         */
        this.save = function save() {
            fs.writeFile(STORE_FILENAME, JSON.stringify(self.getStore()));
        };

        /**
         * Load store from file.
         */
        this.load = function load() {
            log.info('Load store from file.', { fileName: STORE_FILENAME });

            try {
                if (fs.existsSync(STORE_FILENAME)) {
                    var fileData = fs.readFileSync(STORE_FILENAME, 'utf8');
                    var rawData = JSON.parse(fileData);

                    data = {};
                    _.each(rawData, function(entry) {
                        data[entry.key] = { value: entry.value, description: entry.description };
                    });
                }
            } catch (ex) {
                log.error('Load store from file failed.', { error: ex.error, message: ex.message });
            }
        };
    };

    yak.exports.store = new yak.Store();
}());

