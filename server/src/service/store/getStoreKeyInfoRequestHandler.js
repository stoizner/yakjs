/**
 * GetStoreKeyInfoRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.GetStoreKeyInfoRequestHandler = function GetStoreKeyInfoRequestHandler(yakServer) {
    /**
     * @type {yak.Store}
     */
    var store = yak.require('store');

    /**
    * @param {yak.api.GetStoreKeyInfoRequest} request
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(request, connection) {
        try {
            var logger = yakServer.getLogger();
            logger.debug('GetStoreKeyInfoRequestHandler', { request: request });

            var response = new yak.api.GetStoreKeyInfoResponse(request.id);
             response.keys = [];

            var storeData = store.getStore();

            _.each(storeData, function each(entry) {
                response.keys.push({key: entry.key, description:entry.description});
            });

            connection.send(response);
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
