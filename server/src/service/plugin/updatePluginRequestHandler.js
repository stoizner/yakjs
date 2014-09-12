/**
 * UpdatePluginRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.UpdatePluginRequestHandler = function UpdatePluginRequestHandler(yakServer) {
    /**
     * @type {yak.PluginCodeChecker}
     */
    var pluginCodeChecker = new yak.PluginCodeChecker();

    /**
     * @param {yak.api.UpdatePluginRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(request, connection) {

        try {
            if (yakServer.pluginManager.hasPlugin(request.pluginName)) {
                var codeCheck = pluginCodeChecker.checkCode(request.code);

                if (codeCheck.isValid) {
                    yakServer.pluginManager.removePlugin(request.pluginName);
                    yakServer.pluginManager.createOrUpdatePlugin(request.name, request.description, request.code);
                    yakServer.pluginManager.savePlugins();
                    sendSuccessResponse(connection);
                } else {
                    sendInvalidCodeResponse(codeCheck, connection);
                }
            } else {
                sendPluginNotFoundResponse(request, connection);
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
        var response = new yak.api.UpdatePluginResponse();
        connection.send(response);
    }

    /**
     * Send an error response
     * @param {yak.RemovePluginRequest} message
     * @param {yak.WebSocketConnection} connection
     */
    function sendPluginNotFoundResponse(message, connection) {
        var response = new yak.api.DeletePluginResponse();
        response.success = false;
        response.message = 'Can not find plugin: ' + message.pluginName;
        connection.send(response);
    }

    /**
     * Send an error response
     * @param {{isValid:boolean, errors:[]}} codeCheck
     * @param {yak.WebSocketConnection} connection
     */
    function sendInvalidCodeResponse(codeCheck, connection) {
        var response = new yak.api.CreatePluginResponse();
        response.success = false;
        response.message = 'Code is not valid: \n';
        response.message += codeCheck.errors.join('\n');

        connection.send(response);
    }
};
