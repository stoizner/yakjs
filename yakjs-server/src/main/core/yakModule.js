/**
  * YAKjs server internal exports of modules, that
  * can be consumed by lugins.
  * @type {Object}
  */
yak.exports = {};

/**
 * YAKjs server own require implementations. It first looks
 * int YAKjs internal modules. If no module was found it
 * falls back to the nodejs module loading system. (see: http://nodejs.org/api/modules.html)
 * @param {string} id module id
 */
yak.require = function yakRequire(id) {
    'use strict';

    var module;

    if (yak.exports.hasOwnProperty(id)) {
        module = yak.exports[id];
    } else {
        module = require(id);
    }

    return module;
};
