/**
 * DeleteStoreItemRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.DeleteStoreItemRequestHandler = function DeleteStoreItemRequestHandler(yakServer) {
    /**
     * @type {yak.Store}
     */
    var store = yak.require('store');

    /**
    * @param {yak.api.SetStoreValueRequest} request
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(request, connection) {

        try {
            var logger = yakServer.getLogger();
            logger.debug('DeleteStoreItemRequestHandler', { request: request });

            var response = new yak.api.DeleteStoreItemResponse();
            response.requestId = request.id;

            response.success = store.deleteKey(request.key);

            connection.send(response);
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
