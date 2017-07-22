'use strict';

const storeProvider = require('../../../store/storeProvider');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function postStoreItemsRoute(request, response) {
    /**
     * @type {!StoreKeyValueItem}
     */
    const requestedStoreItem = request.body.storeItem;

    if (storeProvider.hasValue(requestedStoreItem.key)) {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'Invalid store item key or store item with given key already exists.'
        });
    } else {
        storeProvider.updateItem(requestedStoreItem.key, requestedStoreItem.value);
        response.send();
    }
}

module.exports = postStoreItemsRoute;
