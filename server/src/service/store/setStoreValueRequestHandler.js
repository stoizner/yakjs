/**
 * SetStoreValueRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.SetStoreValueRequestHandler = function SetStoreValueRequestHandler(yakServer) {
    var store = yak.require('store');

    /**
    * @param {yak.api.SetStoreValueRequest} request
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(request, connection) {
        try {
            var logger = yakServer.getLogger();
            logger.debug('SetStoreValueRequestHandler', { request: request });

            var response = new yak.api.SetStoreValueResponse();
            response.requestId = request.id;

            store.setValue(request.key,  request.value);

            connection.send(response);
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
