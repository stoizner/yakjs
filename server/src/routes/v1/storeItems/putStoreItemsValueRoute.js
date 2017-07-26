'use strict';

const storeProvider = require('../../../store/storeProvider');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function putStoreItemsValueRoute(request, response) {
    /**
     * @type {string}
     */
    const requestedStoreItemKey = request.params.key;

    /**
     * @type {!StoreKeyValueItem}
     */
    const requestedStoreItemValue = request.body;

    if (requestedStoreItemKey && storeProvider.hasValue(requestedStoreItemKey)) {
        storeProvider.updateItem(requestedStoreItemKey, requestedStoreItemValue);

        response.send();
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'Store item with given key does not exist.'
        });
    }
}

module.exports = putStoreItemsValueRoute;
