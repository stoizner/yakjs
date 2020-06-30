'use strict'

const BASE_URL = '/v2'

export class RequestSender {
    /**
     * @param {string} apiPath
     * @returns {Promise<any>}
     */
    getRequest(apiPath) {
        return fetch(BASE_URL + apiPath).then(response => response.json());
    }

    /**
     * @param {string} apiPath
     * @returns {Promise<any>}
     */
    postRequest(apiPath) {
        return fetch(BASE_URL + apiPath, {method: 'POST'});
    }
}

