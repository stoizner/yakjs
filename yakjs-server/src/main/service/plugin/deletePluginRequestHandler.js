/**
 * DeletePluginRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.DeletePluginRequestHandler = function DeletePluginRequestHandler(yakServer) {

    'use strict';

    /**
     * Constructor
     */
    function constructor() {
    }

    /**
    * @param {yak.api.DeletePluginRequest} message
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {

        try {
            if (yakServer.pluginManager.hasPlugin(message.pluginName)) {
                yakServer.pluginManager.removePlugin(message.pluginName);
                yakServer.pluginManager.updateAndSaveConfig();
                sendSuccessResponse(connection);
            } else {
                sendPluginNotFoundResponse(message, connection);
            }
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };

    /**
    * Send success response
    * @param {yak.WebSocketConnection} connection
    */
    function sendSuccessResponse(connection) {
        var response = new yak.api.DeletePluginResponse();
        connection.send(response);
    }

    /**
    * Send an error response
    * @param {yak.WebSocketConnection} connection
    * @param {yak.DeletePluginRequest} message
    */
    function sendPluginNotFoundResponse(message, connection) {
        var response = new yak.api.DeletePluginResponse();
        response.success = false;
        response.message = 'Can not find plugin: ' + message.pluginName;
        connection.send(response);
    }

    constructor();
};