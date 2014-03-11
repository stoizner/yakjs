/**
 * GetLogInfoRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.GetLogInfoRequestHandler = function GetLogInfoRequestHandler(yakServer) {

    'use strict';

    /**
    * @param {yak.WebSocketMessage} message
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {

        try {
            var logger = yakServer.getLogger();
            var response = new yak.api.GetLogInfoResponse();

            response.logs = logger.getLogs();

            connection.send(response);
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};