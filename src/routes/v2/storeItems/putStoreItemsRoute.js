'use strict';

import HttpStatus from 'http-status-codes';
import storeProvider from '../../../store/storeProvider.js';

/**
 * @param request
 * @param response
 */
export function putStoreItemsRoute(request, response) {
    /**
     * @type {string}
     */
    const requestedStoreItemKey = request.params.key;

    /**
     * @type {!StoreKeyValueItem}
     */
    const requestedStoreItem = request.body.storeItem;

    if (requestedStoreItemKey && storeProvider.hasValue(requestedStoreItemKey)) {
        storeProvider.updateItem(requestedStoreItem.key, requestedStoreItem.value);

        // Key was changed, so delete old store item.
        if (requestedStoreItemKey !== requestedStoreItem.key) {
            storeProvider.deleteItem(requestedStoreItemKey);
        }

        response.send();
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'Invalid store item key or store item with given key does not exist.'
        });
    }
}
