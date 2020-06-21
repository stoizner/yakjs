'use strict';

const storeProvider = require('../../../store/storeProvider');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function deleteStoreItemsRoute(request, response) {
    /**
     * @type {string}
     */
    const requestedStoreItemKey = request.params.key;

    if (storeProvider.hasValue(requestedStoreItemKey)) {
        storeProvider.deleteItem(requestedStoreItemKey);
        response.send();
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'No store item to delete for given key found.'
        });
    }
}

module.exports = deleteStoreItemsRoute;
