'use strict';

import storeProvider from '../../../store/storeProvider.js';
import HttpStatus from 'http-status-codes';

/**
 * @param request
 * @param response
 */
export function getStoreItemKeysRoute(request, response) {
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
