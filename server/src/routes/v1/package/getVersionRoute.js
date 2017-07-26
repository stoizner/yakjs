'use strict';

const fs = require('fs');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function getVersionRoute(request, response) {
    var versionInfo = {};

    readFile('package.json')
        .then(pkg => {
            versionInfo.version = pkg.version;
        })
        .catch(() => readFile('../package.json').then(pkg => {
            versionInfo.version = pkg.version;
        }))
        .then(() => response.send(versionInfo))
        .catch(error => response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error));
}

/**
 * @param {string} filename
 * @returns {!Promise}
 */
function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (error, file) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(file));
            }
        });
    });
}

module.exports = getVersionRoute;
