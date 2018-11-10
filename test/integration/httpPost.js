'use strict';

const http = require('http');
const url = require('url');

/**
 * @param {string} urlString
 * @param {Buffer} data
 * @param {string} contentType
 * @returns {Promise<any>}
 */
module.exports = function httpPost(urlString, data, contentType = 'text/plain') {
    const urlData = url.parse(urlString);

    const options = {
        hostname: urlData.hostname,
        port: urlData.port,
        path: urlData.path,
        method: 'POST',
        headers: {
            'Content-Type': contentType,
            'Content-Length': Buffer.byteLength(data)
        }
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

        request.write(data);
        request.end();
    });
};
