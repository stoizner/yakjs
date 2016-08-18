/**
 * @constructor
 */
yak.ModuleProvider = function ModuleProvider() {
    'use strict';

    var fs = require('fs');
    var path = require('path');

    /**
     * @type {!yak.ModuleProvider}
     */
    var self = this;

    /**
     * @type {string}
     */
    var MODULES_DIRECTORY = './modules/';

    /**
     * @type {string}
     */
    var MODULE_EXTENSION = '.js';

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @param {string} moduleFilename The module filename.
     * @param {string} content
     */
    this.createOrUpdate = function createOrUpdate(moduleFilename, content) {
        log.info('createOrUpdate module', {moduleFilename: moduleFilename});
        fs.writeFileSync(MODULES_DIRECTORY + moduleFilename, content, {encoding: 'utf8'});
    };

    /**
     * @param {string} moduleName
     */
    this.deleteModule = function deleteModule(moduleName) {
        var moduleFilename = MODULES_DIRECTORY + moduleName + MODULE_EXTENSION;
        fs.unlinkSync(moduleFilename);
    };

    /**
     * @returns {!Array<string>} List of all available modules.
     */
    this.getAllModuleNames = function getAllModuleNames() {
        var moduleFilenames = fs.readdirSync('./modules');
        return moduleFilenames.map(filename => path.basename(filename, MODULE_EXTENSION));
    };

    /**
     * Custom modules can be updated during a YAKjs lifetime.
     * Clear the cache to get the latest module implementation the next time.
     */
    this.clearModuleCache = function clearModuleCache() {
        log.info('clearModuleCache');

        var moduleNames = self.getAllModuleNames();

        moduleNames.forEach((moduleName) => {
            var fullModuleName = MODULES_DIRECTORY + moduleName;
            delete require.cache[require.resolve(fullModuleName)];
        });
    };
};
