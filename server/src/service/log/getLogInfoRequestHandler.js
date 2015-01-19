/**
 * GetLogInfoRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.GetLogInfoRequestHandler = function GetLogInfoRequestHandler(yakServer) {
    /**
     * @param {yak.api.GetLogInfoRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(request, connection) {

        try {
            var logger = yakServer.getLogger();
            var response = new yak.api.GetLogInfoResponse(request.id);

            response.logs = logger.getLogs();

            connection.send(response);
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
