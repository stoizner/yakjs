/* global require:true */

/**
 * YAKjs server own require implementations. It first looks
 * for YAKjs internal modules. If no module was found, it
 * falls back to the nodejs module loading system. (see: http://nodejs.org/api/modules.html)
 * @param {string} moduleName The module name
 * @returns {*} The required module.
 */
yak.require = function yakRequire(moduleName) {
    var moduleLoaders = [
        yak.loadInternalModule,
        yak.loadCustomModule,
        yak.loadNodeModule
    ];

    return moduleLoaders.reduce(_.partial(yak.findModule, moduleName), null);
};

/**
 * @param {string} moduleName
 * @param {Object} previousModule
 * @param {function(string):Object} loader
 * @returns {Object} The loaded module or null.
 */
yak.findModule = function findModule(moduleName, previousModule, loader) {
    var module = previousModule;

    // A module was already loaded, so no more loading required.
    if (!previousModule) {
        module = loader(moduleName);
    }

    return module;
};

yak.loadCustomModule = function loadCustomModule(moduleName) {
    var module = null;

    try {
        var fullModuleName = './modules/' + moduleName;
        module = require(fullModuleName);
    } catch(ex) {
        // Just ignore any exceptions and continue.
    }

    return module;
};

/**
 * Loads a node module.
 * @param {string} moduleName
 * @returns {Object} The loaded module or null.
 */
yak.loadNodeModule = function findNodeModule(moduleName) {
    return require(moduleName);
};

/**
 * Loads an internal module.
 * @param {string} moduleName
 * @returns {Object} The loaded module or null.
 */
yak.loadInternalModule = function findInternalModule(moduleName) {
    var module = null;

    if (_.has(yak.modules, moduleName)) {
        module = yak.modules[moduleName];
    }

    return module;
};


