/**
 * CreatePluginRequestHandler
 * @constructor
 * @param {yak.YakServer} yakjs
 * @implements {yak.ServiceMessageHandler}
 */
yak.CreatePluginRequestHandler = function CreatePluginRequestHandler(yakjs) {
    /**
     * @type {yak.PluginCodeChecker}
     */
    var pluginCodeChecker = new yak.PluginCodeChecker();

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(this.constructor.name);

    /**
     * @param {yak.api.CreatePluginRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(request, connection) {
        try {
            if (request.name === null || request.name === '') {
                log.warn('Invalid plugin name', {name: request.name});
                sendInvalidNameResponse(request, connection);
            } else {
                var pluginId = request.name.replace('.plugin', '');
                var plugin = yakjs.pluginManager.getPlugin(pluginId);

                if (plugin) {
                    log.warn('Plugin already exists.', {id: pluginId});
                    sendPluginAlreadyExistsResponse(request, connection);
                } else {
                    var codeCheck = pluginCodeChecker.checkCode(request.code);

                    if (codeCheck.isValid) {
                        var newPlugin = null;

                        if (yakjs.pluginManager.hasJsDoc(request.code)) {
                            newPlugin = yakjs.pluginManager.parsePluginContent(pluginId, request.code);
                        } else {
                            newPlugin = new yak.Plugin();
                            newPlugin.id = pluginId;
                            newPlugin.name = pluginId;
                            newPlugin.version = request.version;
                            newPlugin.description = request.description;
                            newPlugin.code = request.code;
                        }

                        yakjs.pluginManager.addPlugin(newPlugin);
                        yakjs.pluginManager.savePlugin(newPlugin);

                        sendSuccessResponse(request, connection);
                    } else {
                        log.warn('Plugin code is not valid.', {codeCheck: codeCheck});
                        sendInvalidCodeResponse(request, codeCheck, connection);
                    }
                }
            }
        } catch (ex) {
            log.error(ex.message);
        }
    };

    /**
     * Send success response.
     * @param {yak.CreatePluginRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    function sendSuccessResponse(request, connection) {
        var response = new yak.api.CreatePluginResponse(request.id);
        connection.send(response);
    }

    /**
     * Send an error response.
     * @param {yak.CreatePluginRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    function sendPluginAlreadyExistsResponse(request, connection) {
        var response = new yak.api.CreatePluginResponse(request.id);
        response.success = false;
        response.message = 'Cannot create plugin: Name \'' + request.name + '\' is already used.';
        connection.send(response);
    }

    /**
     * Send an error response.
     * @param {yak.CreatePluginRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    function sendInvalidNameResponse(request, connection) {
        var response = new yak.api.CreatePluginResponse(request.id);
        response.success = false;
        response.message = 'Name is not valid.';
        connection.send(response);
    }

    /**
     * Send an error response.
     * @param {yak.CreatePluginRequest} request
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
