'use strict';

const fs = require('fs');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function getVersionRoute(request, response) {
    fs.readFile('package.json', 'utf8', (error, file) => {
        if (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        } else {
            let pkg = JSON.parse(file);
            response.send({version: pkg.version});
        }
    });
}

module.exports = getVersionRoute;
