'use strict';

const _ = require('underscore');

/* global require:true */

/**
 * YAKjs server own require implementations. It first looks
 * for YAKjs internal modules. If no module was found, it
 * falls back to the nodejs module loading system. (see: http://nodejs.org/api/modules.html)
 * @param {string} moduleName The module name
 * @returns {*} The required module.
 */
function yakRequire(moduleName) {
    let moduleLoaders = [
        findInternalModule,
        loadCustomModule,
        findNodeModule
    ];

    return moduleLoaders.reduce(_.partial(findModule, moduleName), null);
}

/**
 * @param {string} moduleName
 * @param {Object} previousModule
 * @param {function(string):Object} loader
 * @returns {Object} The loaded module or null.
 */
function findModule(moduleName, previousModule, loader) {
    let module = previousModule;

    // A module was already loaded, so no more loading required.
    if (!previousModule) {
        module = loader(moduleName);
    }

    return module;
}

function loadCustomModule(moduleName) {
    let module = null;

    try {
        let fullModuleName = '../../modules/' + moduleName;
        module = require(fullModuleName);
    } catch(ex) {
        // Just ignore any exceptions and continue.
    }

    return module;
}

/**
 * Loads a node module.
 * @param {string} moduleName
 * @returns {Object} The loaded module or null.
 */
function findNodeModule(moduleName) {
    return require(moduleName);
}

/**
 * Loads an internal module.
 * @param {string} moduleName
 * @returns {Object} The loaded module or null.
 */
function findInternalModule(moduleName) {
    let module = null;

    try {
        let fullModuleName = '../modules/shared/' + moduleName;
        module = require(fullModuleName);
    } catch(ex) {
        // Just ignore any exceptions and continue.
    }

    return module;
}

module.exports = yakRequire;

