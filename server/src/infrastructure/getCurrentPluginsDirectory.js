'use strict';

const process = require('process');
const path = require('path');

/**
 * @returns {string}
 */
function getCurrentPluginsDirectory() {
    return path.join(process.cwd(),  './plugins/');
}

module.exports = getCurrentPluginsDirectory;
