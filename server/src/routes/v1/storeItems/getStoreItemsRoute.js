'use strict';

const storeProvider = require('../../../store/storeProvider');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function getStoreItemKeysRoute(request, response) {
    /**
     * @type {string}
     */
    const requestedStoreItemKey = request.params.key;

    if (storeProvider.hasValue(requestedStoreItemKey)) {
        let storeItemValue = storeProvider.getValue(requestedStoreItemKey);

        response.send({
            storeItem: {
                key: requestedStoreItemKey,
                value: storeItemValue
            }
        });
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'Store item with given key does not exist.'
        });
    }
}

module.exports = getStoreItemKeysRoute;
