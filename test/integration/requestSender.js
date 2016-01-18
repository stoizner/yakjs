/**
 * @constructor
 * @param {?string} [host]
 * @param {?number} [port]
 */
function RequestSender(host, port) {
    'use strict';

    /**
     * @type {RequestSender}
     */
    var self = this;

    var http = require('http');

    this.host = host || 'localhost';

    this.port = port || 8790;

    /**
     * @param {gruntYak.Request} request
     * @returns {Promise} Returns a request promise.
     */
    this.sendRequest = function sendRequest(request) {
        return post('/api/', request);
    };

    /**
     * @param {string} path The url path, always start with a forward slash '/'.
     * @param {Object} data
     * @returns {Promise} Returns a request promise.
     */
    function post(path, data) {
        return new Promise(function postPromise(resolve, reject) {
            var jsonData = JSON.stringify(data);

            var options = {
                host: self.host,
                port: self.port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': jsonData.length
                }
            };

            var request = http.request(options, function handleResponse(httpResponse) {
                httpResponse.setEncoding('utf8');
                httpResponse.on('data', function handleOnData(chunk) {
                    if (httpResponse.statusCode === 200) {
                        var response = '';
                        try {
                            response = JSON.parse(chunk);

                            if (response.success) {
                                resolve(chunk);
                            } else {
                                reject({
                                    jsonData: jsonData,
                                    request: options,
                                    statusCode: httpResponse.statusCode,
                                    error: chunk
                                });
                            }
                        } catch(ex) {
                            reject(ex);
                        }
                    } else {
                        reject({
                            jsonData: jsonData,
                            request: options,
                            statusCode: httpResponse.statusCode,
                            error: chunk
                        });
                    }
                });
            });

            request.write(jsonData);
            request.end();
        });
    }
}

exports.RequestSender = RequestSender;
