'use strict';

const fs = require('fs');
const path = require('path');
const Logger = require('../infrastructure/logger');
const Module = require('./module');

/**
 * @constructor
 * @struct
 */
function ModuleProvider() {
    /**
     * @type {!ModuleProvider}
     */
    const self = this;

    /**
     * @type {string}
     */
    const MODULES_DIRECTORY = './modules/';

    /**
     * @type {string}
     */
    const MODULE_EXTENSION = '.js';

    /**
     * @type {!Logger}
     */
    const log = new Logger(self.constructor.name);

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
        let moduleFilename = MODULES_DIRECTORY + moduleName + MODULE_EXTENSION;
        fs.unlinkSync(moduleFilename);
    };

    /**
     * @returns {!Array<string>} List of all available modules.
     */
    this.getAllModuleNames = function getAllModuleNames() {
        let moduleFilenames = fs.readdirSync('./modules');
        return moduleFilenames.map(filename => path.basename(filename, MODULE_EXTENSION));
    };

    /**
     * @param {string} moduleName
     * @returns {boolean}
     */
    this.exists = function exists(moduleName) {
        let moduleFilename = MODULES_DIRECTORY + moduleName + MODULE_EXTENSION;
        return fs.existsSync(moduleFilename);
    };

    /**
     * @param {string} moduleName
     */
    this.getModule = function getModule(moduleName) {
        let moduleFilename = MODULES_DIRECTORY + moduleName + MODULE_EXTENSION;
        let module = new Module();
        module.name = moduleName;
        module.content = fs.readFileSync(moduleFilename, 'utf8');

        return module;
    };

    /**
     * Custom modules can be updated during a YAKjs lifetime.
     * Clear the cache to get the latest module implementation the next time.
     */
    this.clearModuleCache = function clearModuleCache() {
        log.info('clearModuleCache');

        let moduleNames = self.getAllModuleNames();

        moduleNames.forEach(moduleName => {
            let fullModuleName = path.join(__dirname, '../../', MODULES_DIRECTORY, moduleName);
            delete require.cache[require.resolve(fullModuleName)];
        });
    };

    /**
     * @param {!FileContainer} fileContainer
     * @returns {!Promise}
     */
    this.upload = function upload(fileContainer) {
        return new Promise((resolve, reject) => {
            try {
                self.createOrUpdate(fileContainer.filename, fileContainer.content);
                resolve();
            } catch (ex) {
                log.warn(ex);
                reject('Can not create module.');
            }
        });
    };
}

module.exports = ModuleProvider;
