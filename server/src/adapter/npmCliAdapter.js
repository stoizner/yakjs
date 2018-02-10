'use strict';

const process = require('child_process');

/**
 * @class
 */
class NpmCliAdapter {
    /**
     * @param {string} packageName
     * @returns {!Promise<Object>}
     */
    show(packageName) {
        return new Promise((resolve, reject) => {
            process.exec(`npm show ${packageName} --json`, {encoding: 'utf-8'}, (error, output) => {
                if (error) {
                    reject(error);
                } else {
                    try {
                        resolve(JSON.parse(output));
                    } catch (ex) {
                        reject(ex);
                    }
                }
            });
        });
    }
}

module.exports = new NpmCliAdapter();
