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
     * @type {yak.PluginManager}
     */
    var pluginManager = yakServer.pluginManager;

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(this.constructor.name);

    /**
     * @param {yak.api.UpdatePluginRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(request, connection) {
        try {
            var originalPluginId = request.pluginName.replace('.plugin', '');
            var plugin = pluginManager.getPlugin(originalPluginId);

            if (plugin) {
                var codeCheck = pluginCodeChecker.checkCode(request.code);

                if (codeCheck.isValid) {
                    var pluginId = request.name.replace('.plugin', '');

                    if (pluginId !== originalPluginId) {
                        pluginManager.changePluginId(originalPluginId, pluginId);
                    }

                    if (pluginManager.hasJsDoc(request.code)) {
                        var parsedPlugin = pluginManager.parsePluginContent(request.code);
                        plugin = _.extend(plugin, parsedPlugin);
                    }

                    plugin.description = request.description;
                    plugin.code = request.code;
                    plugin.version = request.version;

                    pluginManager.updatePlugin(plugin);
                    pluginManager.savePlugin(plugin);

                    sendSuccessResponse(request, connection);
                } else {
                    log.warn('Can not update plugin. Code is not valid.', {id: originalPluginId, codeCheck: codeCheck});
                    sendInvalidCodeResponse(request, codeCheck, connection);
                }
            } else {
                log.warn('Can not update plugin. Plugin not found.', {id: originalPluginId});
                sendPluginNotFoundResponse(request, connection);
            }
        } catch (ex) {
            log.error(ex.message);
        }
    };

    /**
     * Send success response
     * @param {yak.api.UpdatePluginRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    function sendSuccessResponse(request, connection) {
        var response = new yak.api.UpdatePluginResponse(request.id);
        connection.send(response);
    }

    /**
     * Send an error response
     * @param {yak.api.UpdatePluginRequest} request
     * @param {yak.RemovePluginRequest} message
     * @param {yak.WebSocketConnection} connection
     */
    function sendPluginNotFoundResponse(request, message, connection) {
        var response = new yak.api.DeletePluginResponse(request.id);
        response.success = false;
        response.message = 'Can not find plugin: ' + message.pluginName;
        connection.send(response);
    }

    /**
     * Send an error response
     * @param {yak.api.UpdatePluginRequest} request
     * @param {{isValid:boolean, errors:[]}} codeCheck
     * @param {yak.WebSocketConnection} connection
     */
    function sendInvalidCodeResponse(request, codeCheck, connection) {
        var response = new yak.api.CreatePluginResponse(request.id);
        response.success = false;
        response.message = 'Code is not valid: \n';
        response.message += codeCheck.errors.join('\n');

        connection.send(response);
    }
};
