/**
 * GetStoreValueRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.GetStoreValueRequestHandler = function GetStoreValueRequestHandler(yakServer) {
    /**
     * @type {yak.Store}
     */
    var store = yak.require('store');

    /**
    * @param {yak.api.GetStoreValueRequest} request
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(request, connection) {

        try {
            var logger = yakServer.getLogger();
            var key = request.key;

            logger.debug('GetStoreValueRequestHandler', { key: key });
            var response = new yak.api.GetStoreValueResponse(request.id);

            var storeItem = store.getStoreItem(key);

            response.key = key;
            response.description = storeItem.description;
            response.value = storeItem.value;

            connection.send(response);
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
