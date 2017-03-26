/* global: global */

// Setup of test libs
const chai = require('chai');
const sinon = require('sinon');
const sinonChai= require('sinon-chai');
const expect = chai.expect;
const request = require('request');

chai.use(sinonChai);

const INTEGRATION_SERVER = 'http://localhost:8790';

/**
 * @param {string} path
 * @returns {Promise}
 */
function promiseRequest(path) {
    return new Promise((resolve, reject) => {
        request(INTEGRATION_SERVER + path, (error, response, body) => {
            if (error) {
                reject(error)
            } else {
                if (response.statusCode !== 200) {
                    reject(response.statusCode)
                } else {
                    resolve({
                        response: response,
                        body: body
                    });
                }
            }
        });
    });
}

// Export stuff for writing tests.
module.exports = {
    expect: expect,
    sinon: sinon,
    request: promiseRequest
};
