/**
 * YAKjs server own require implementations. It first looks
 * int YAKjs internal modules. If no module was found it
 * falls back to the nodejs module loading system. (see: http://nodejs.org/api/modules.html)
 * @param {string} id module id
 */
yak.require = function yakRequire(id) {
    'use strict';

    var module;
    var npm = require('npm');
    npm.load();

    if (yak.exports.hasOwnProperty(id)) {
        module = yak.exports[id];
    } else {

        npm.commands.list(function (er, data) {
            console.log('list:' , { data: data });
        });

        module = require(id);
    }

    return module;
};

