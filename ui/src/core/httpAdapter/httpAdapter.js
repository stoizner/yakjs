/**
 * HttpAdapter
 * @constructor
 * @param {cobu.EventBus} eventBus
 */
yak.ui.HttpAdapter = function HttpAdapter(eventBus) {
    'use strict';

    /**
     * @type {yak.ui.HttpAdapter}
     */
    var self = this;

    /**
     * Response to request callback map.
     * @type {Object<string, function(yak.api.Response)>}
     */
    var requestResponseCallbackMap = {};

    /**
     * Constructor
     */
    function constructor() {
    }

    /**
     * Send a request to the YAKjs server
     * @param {yak.api.Request} request
     * @param {Function} responseCallback Callback function for handling response message.
     */
    this.sendRequest = function sendRequest(request, responseCallback) {
        console.warn('Sending request with sendRequest is obsolete', {request: request});

        if (!request.id) {
            throw new Error('Can not send a request without an request id.');
        }
        requestResponseCallbackMap[request.id] = responseCallback;

        send(request);
    };

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
     * @param {!yak.api.Request} request
     * @returns {Promise}
     */
    this.post = function post(url, request) {
        return sendHttpJsonRequest('POST', url, request).then(maybeJsonParse);
    };

    /**
     * @param {string} url
     * @param {!yak.api.Request} request
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

    /**
     * @param {string|object} message
     */
    function send(message) {
        if (typeof message === 'object') {
            $.ajax({
                url: '/api/' + message.type,
                type: 'POST',
                data: JSON.stringify(message),
                contentType: 'application/json',
                dataType: 'text',
                success: handleMessage
            });
        }
    }

    /**
     * @param {?} data
     */
    function handleMessage(data) {
        var msg = null;

        try {
            msg = JSON.parse(data);
        } catch(ex) {
            console.error(ex);
        }

        if (msg) {
            if (isResponse(msg)) {
                var callback = requestResponseCallbackMap[msg.requestId];
                delete requestResponseCallbackMap[msg.requestId];

                console.log('Response received.', {response: msg});
                if (callback) {
                    callback(msg);
                }
            } else {
                eventBus.post(msg);
            }
        }
    }

    /**
     * Check if a received websocket message is a response.
     * @param {Object} message
     * @returns {boolean} Whether received message is a response.
     */
    function isResponse(message) {
        return message.type && message.type.toLowerCase().indexOf('response') >= 0;
    }

    /**
     * @param {?} event
     */
    function handleError(event) {
        console.warn('yak.ui.HttpAdapter.handleError', {event: event});

        if (self.onerror) {
            self.onerror();
        }

        eventBus.post(new yak.ui.HttpErrorEvent());
    }

    constructor();
};
