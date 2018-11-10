'use strict';

const http = require('http');
const url = require('url');

/**
 * @param {string} urlString
 * @returns {Promise<any>}
 */
module.exports = function httpDelete(urlString) {
    const urlData = url.parse(urlString);

    const options = {
        hostname: urlData.hostname,
        port: urlData.port,
        path: urlData.path,
        method: 'DELETE'
    };

    return new Promise((resolve, reject) => {
        const request = http.request(options, response => {
            let content = '';

            response.setEncoding('utf8');
            response.on('data', chunk => {
                content += chunk;
            });
            response.on('end', () => {
                resolve({
                    response,
                    content
                });
            });
        });

        request.on('error', reject);
        request.end();
    });
};
