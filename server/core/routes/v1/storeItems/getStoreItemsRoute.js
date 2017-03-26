'use strict';

const _ = require('underscore');
const storeProvider = require('../../../store/storeProvider');

/**
 * @param request
 * @param response
 */
function getStoreItemKeysRoute(request, response)  {
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
        response.status(400).send({
            message: 'Store item with given key does not exist.'
        });
    }
}

module.exports = getStoreItemKeysRoute;
