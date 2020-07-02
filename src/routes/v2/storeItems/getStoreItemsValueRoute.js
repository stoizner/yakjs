'use strict';

import HttpStatus from 'http-status-codes';
import storeProvider from '../../../store/storeProvider.js';

/**
 * @param request
 * @param response
 */
export function getStoreItemsValueRoute(request, response) {
    /**
     * @type {string}
     */
    const requestedStoreItemKey = request.params.key;

    if (storeProvider.hasValue(requestedStoreItemKey)) {
        let storeItemValue = storeProvider.getValue(requestedStoreItemKey);

        response.send(storeItemValue);
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'Store item with given key does not exist.'
        });
    }
}
