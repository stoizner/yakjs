/**
 * @constructor
 * @struct
 */
function HttpAdapter() {
    'use strict';

    /**
     * @param {string} url
     * @returns {!Promise}
     */
    this.get = function get(url) {
        console.log('GET ' + url);
        return sendHttpJsonRequest('GET', url).then(logResponse).then(maybeJsonParse);
    };

    /**
     * @param {string} url
     * @returns {!Promise}
     */
    this.deleteResource = function deleteResource(url) {
        console.log('DELETE ' + url);
        return sendHttpJsonRequest('DELETE', url).then(logResponse).then(maybeJsonParse);
    };

    /**
     * @param {string} url
     * @param {!Object} [request]
     * @returns {!Promise}
     */
    this.post = function post(url, request) {
        console.log('POST ' + url, {request: request});
        return sendHttpJsonRequest('POST', url, request).then(logResponse).then(maybeJsonParse);
    };

    /**
     * @param {string} url
     * @param {!Object} request
     * @returns {!Promise}
     */
    this.put = function post(url, request) {
        console.log('PUT ' + url, {request: request});
        return sendHttpJsonRequest('PUT', url, request).then(logResponse).then(maybeJsonParse);
    };

    /**
     * @param {T} response
     * @template T
     * @returns T
     */
    function logResponse(response) {
        console.log('Response received', {response: response});

        return response
    }
    /**
     * @param {string} url
     * @param {string} type
     * @param [data]
     * @returns {!Promise}
     */
    function sendHttpJsonRequest(type, url, data) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: '/v1' + url,
                type: type,
                data: data ? JSON.stringify(data) : null,
                contentType: 'application/json',
                dataType: 'text',
                success: resolve,
                error: function(request, message, error) {
                    var responseError = { message: message};
                    if (request.responseText) {
                        responseError = JSON.parse(request.responseText);
                    }
                    reject(responseError);
                }
            });
        });
    }

    function maybeJsonParse(response) {
        var data = null;

        if (response) {
            try {
                data = JSON.parse(response);
            } catch(error) {
                console.warn('Could not parse received JSON data', {response: response, error: error});
            }
        }

        return data;
    }
}

/**
 * @type {!HttpAdapter}
 */
module.exports = new HttpAdapter();
