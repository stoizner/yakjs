'use strict';

import storeProvider from '../../../store/storeProvider.js';

/**
 * @param request
 * @param response
 */
export function getStoreItemKeysRoute(request, response) {
    let storeItems = storeProvider.getStoreItems();

    response.send({
        keys: storeItems.map(item => item.key)
    });
}
