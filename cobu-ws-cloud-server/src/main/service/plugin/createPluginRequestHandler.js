/**
 * CreatePluginRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.CreatePluginRequestHandler = function CreatePluginRequestHandler(cloudServer) {

    'use strict';

    /**
     * @type {cobu.wsc.PluginCodeChecker}
     */
    var pluginCodeChecker = new cobu.wsc.PluginCodeChecker();

    /** Constructor */
    function constructor() {
    }

    /**
    * @param {cobu.wsc.service.CreatePluginRequest} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {

        try {
            if (cloudServer.pluginManager.hasPlugin(message.name)) {
                sendPluginAlreadyExistsResponse(message, connection);
            } else if (message.name === null || message.name === '') {
                sendInvalidNameResponse(message, connection);
            } else {

                var codeCheck = pluginCodeChecker.checkCode(message.code);

                if (codeCheck.isValid) {
                    cloudServer.pluginManager.createOrUpdatePlugin(message.name, message.description, message.code);
                    sendSuccessResponse(connection);
                } else {
                    sendInvalidCodeResponse(codeCheck, connection);
                }
            }
        } catch (ex) {
            cloudServer.serviceInstance.log.error(ex.message);
        }
    };



    /**
    * Send success response
    * @param {cobu.wsc.WebSocketConnection} connection
    */
    function sendSuccessResponse(connection) {
        var response = new cobu.wsc.service.CreatePluginResponse();
        connection.send(response);
    }

    /**
    * Send an error response
    * @param {cobu.wsc.service.CreatePluginRequest} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
    function sendPluginAlreadyExistsResponse(message, connection) {
        var response = new cobu.wsc.service.CreatePluginResponse();
        response.success = false;
        response.message = 'Cannot create plugin: Name \'' + message.name + '\' is already used.';
        connection.send(response);
    }

    /**
     * Send an error response
     * @param {cobu.wsc.service.CreatePluginRequest} message
     * @param {cobu.wsc.WebSocketConnection} connection
     */
    function sendInvalidNameResponse(message, connection) {
        var response = new cobu.wsc.service.CreatePluginResponse();
        response.success = false;
        response.message = 'Name is not valid.';
        connection.send(response);
    }

    /**
     * Send an error response
     * @param {{isValid:boolean, errors:[]}} codeCheck
     * @param {cobu.wsc.WebSocketConnection} connection
     */
    function sendInvalidCodeResponse(codeCheck, connection) {
        var response = new cobu.wsc.service.CreatePluginResponse();
        response.success = false;
        response.message = 'Code is not valid: \n';
        response.message += codeCheck.errors.join('\n');

        connection.send(response);
    }

    constructor();
};