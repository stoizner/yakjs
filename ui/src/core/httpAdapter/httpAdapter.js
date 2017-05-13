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
        return sendHttpJsonRequest('GET', url).then(maybeJsonParse);
    };

    /**
     * @param {string} url
     * @returns {Promise}
     */
    this.deleteResource = function deleteResource(url) {
        return sendHttpJsonRequest('DELETE', url).then(maybeJsonParse);
    };

    /**
     * @param {string} url
     * @param {!Object} [request]
     * @returns {Promise}
     */
    this.post = function post(url, request) {
        return sendHttpJsonRequest('POST', url, request).then(maybeJsonParse);
    };

    /**
     * @param {string} url
     * @param {!Object} request
     * @returns {Promise}
     */
    this.put = function post(url, request) {
        return sendHttpJsonRequest('PUT', url, request).then(maybeJsonParse);
    };

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
