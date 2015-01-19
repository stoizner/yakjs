/**
 * DeletePluginRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.DeletePluginRequestHandler = function DeletePluginRequestHandler(yakServer) {
    /**
     * @param {yak.api.DeletePluginRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(request, connection) {
        try {
            var pluginId = request.pluginName.replace('.plugin', '');
            var plugin = yakServer.pluginManager.getPlugin(pluginId);

            if (plugin) {
                yakServer.pluginManager.removePlugin(pluginId);
                sendSuccessResponse(request, connection);
            } else {
                sendPluginNotFoundResponse(request, connection);
            }
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };

    /**
     * Send success response
     * @param {yak.DeletePluginRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    function sendSuccessResponse(request, connection) {
        var response = new yak.api.DeletePluginResponse(request.id);
        connection.send(response);
    }

    /**
     * Send an error response
     * @param {yak.DeletePluginRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    function sendPluginNotFoundResponse(request, connection) {
        var response = new yak.api.DeletePluginResponse(request.id);
        response.success = false;
        response.message = 'Can not find plugin: ' + request.pluginName;
        connection.send(response);
    }
};
