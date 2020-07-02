'use strict';

import https from 'https';

const userAgent = 'YAKjs';

/**
 * @class
 */
export class GutHubApiAdapter {
    /**
     * @param {string} path
     * @returns {!Promise<Object>}
     */
    get(path) {
        const gitHubOptions = {
            protocol: 'https:',
            hostname: 'api.github.com',
            port: 443,
            path: path,
            contentType: 'application/json',
            dataType: 'text',
            timeout: 2000,
            headers: {
                'User-Agent': userAgent
            }
        };

        return new Promise((resolve, reject) => {
            https.get(gitHubOptions, response => {
                let data = '';
                response.on('data', chunk => {
                    data += chunk;
                });
                response.on('end', () => resolve(JSON.parse(data)));
            }).on('error', reject);
        });
    }
}
