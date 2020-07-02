'use strict';

import storeProvider from '../../../store/storeProvider.js';
import HttpStatus from 'http-status-codes';

/**
 * @param request
 * @param response
 */
export function putStoreItemsValueRoute(request, response) {
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
