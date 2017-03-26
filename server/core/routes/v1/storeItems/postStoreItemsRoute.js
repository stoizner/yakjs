'use strict';

const storeProvider = require('../../../store/storeProvider');

/**
 * @param request
 * @param response
 */
function postStoreItemsRoute(request, response)  {
    /**
     * @type {!StoreKeyValueItem}
     */
    const requestedStoreItem = request.body.storeItem;

    if (!storeProvider.hasValue(requestedStoreItem.key)) {
        storeProvider.updateItem(requestedStoreItem.key, requestedStoreItem.value);
        response.send();
    } else {
        response.status(400).send({
            message: 'Invalid store item key or store item with given key already exists.'
        });
    }
}

module.exports = postStoreItemsRoute;
