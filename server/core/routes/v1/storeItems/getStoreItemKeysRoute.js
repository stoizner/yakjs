'use strict';

const storeProvider = require('../../../store/storeProvider');

/**
 * @param request
 * @param response
 */
function getStoreItemKeysRoute(request, response) {
    let storeItems = storeProvider.getStoreItems();

    response.send({
        keys: storeItems.map(item => item.key)
    });
}

module.exports = getStoreItemKeysRoute;
