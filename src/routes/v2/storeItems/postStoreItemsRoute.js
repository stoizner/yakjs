'use strict';

import HttpStatus from 'http-status-codes';
import storeProvider from '../../../store/storeProvider.js';

/**
 * @param request
 * @param response
 */
export function postStoreItemsRoute(request, response) {
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
