'use strict'

const BASE_URL = '/v2'

export class RequestSender {
    /**
     * @param {string} apiPath
     * @param {RequestInit} [requestInit]
     * @returns {Promise<any>}
     */
    getRequest(apiPath, requestInit) {
        const defaultInit = {
            method: 'GET',
            cache: 'no-cache'
        };

        const request = Object.assign(defaultInit, requestInit || {});

        return fetch(BASE_URL + apiPath, request).then(response => response.json());
    }

    /**
     * @param {string} apiPath
     * @param {RequestInit} [requestInit]
     * @returns {Promise<Response>}
     */
    postRequest(apiPath, requestInit) {
        const defaultInit = {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'text/plain'
            },
        };

        const request = Object.assign(defaultInit, requestInit || {});

        return fetch(BASE_URL + apiPath, request);
    }
}

