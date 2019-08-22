'use strict';

const getCurrentPluginsDirectory = require('./getCurrentPluginsDirectory');
const childProcess = require('child_process');
const log = require('../infrastructure/logger').defaultLogger;
const fs = require('fs-extra');

/**
 * Check if a package.json file exists in the plugins folder and install all plugins.
 * @returns {!Promise}
 */
function installPluginModules() {
    return new Promise((resolve, reject) => {
        const pluginCwd = getCurrentPluginsDirectory();

        if (fs.existsSync(pluginCwd + 'package.json')) {
            log.debug('Plugin package.json found, installing plugins...', {pluginCwd});
            childProcess.exec('npm install', {cwd: pluginCwd}, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve(error);
                }
            });
        } else {
            resolve();
        }
    });
}

module.exports = installPluginModules;
