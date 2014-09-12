/* global require:true */

//yak.preservedRequire = require;

/**
 * YAKjs server own require implementations. It first looks
 * for YAKjs internal modules. If no module was found, it
 * falls back to the nodejs module loading system. (see: http://nodejs.org/api/modules.html)
 * @param {string} id module id
 * @returns {*} The required module.
 */
yak.require = function yakRequire(id) {
    var module;

    if (_.has(yak.exports, id)) {
        module = yak.exports[id];
    } else {
        module = require(id);
    }

    return module;
};
