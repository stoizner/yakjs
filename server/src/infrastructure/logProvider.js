'use strict';

const fs = require('fs');
const path = require('path');

const LOG_DIR = './logs/';

/**
 * @param {string} pluginId
 */
function getPluginLogs(pluginId) {
    return new Promise((resolve, reject) => {
        var logFilename = path.join(LOG_DIR, pluginId + '.plugin.log');
        fs.readFile(logFilename, 'utf8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

function getYakjsLogs() {
    return new Promise((resolve, reject) => {
        var logFilename = path.join(LOG_DIR, 'yakjs.log');
        fs.readFile(logFilename, 'utf8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {
    getPluginLogs,
    getYakjsLogs
};

