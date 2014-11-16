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
     * @param {yak.api.CreatePluginRequest} message
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(message, connection) {
        try {
            if (message.name === null || message.name === '') {
                log.warn('Invalid plugin name', {name: message.name});
                sendInvalidNameResponse(message, connection);
            } else {
                var pluginId = message.name.replace('.plugin', '');
                var plugin = yakjs.pluginManager.getPlugin(pluginId);

                if (plugin) {
                    log.warn('Plugin already exists.', {id: pluginId});
                    sendPluginAlreadyExistsResponse(message, connection);
                } else {
                    var codeCheck = pluginCodeChecker.checkCode(message.code);

                    if (codeCheck.isValid) {
                        var newPlugin = null;

                        if (yakjs.pluginManager.hasJsDoc( message.code)) {
                            newPlugin = yakjs.pluginManager.parsePluginContent(pluginId, message.code);
                        } else {
                            newPlugin = new yak.Plugin();
                            newPlugin.id = pluginId;
                            newPlugin.name = pluginId;
                            newPlugin.version = message.version;
                            newPlugin.description = message.description;
                            newPlugin.code = message.code;
                        }

                        yakjs.pluginManager.addPlugin(newPlugin);
                        yakjs.pluginManager.savePlugin(newPlugin);

                        sendSuccessResponse(connection);
                    } else {
                        log.warn('Plugin code is not valid.', {codeCheck: codeCheck});
                        sendInvalidCodeResponse(codeCheck, connection);
                    }
                }
            }
        } catch (ex) {
            log.error(ex.message);
        }
    };

    /**
     * Send success response
     * @param {yak.WebSocketConnection} connection
     */
    function sendSuccessResponse(connection) {
        var response = new yak.api.CreatePluginResponse();
        connection.send(response);
    }

    /**
     * Send an error response
     * @param {yak.CreatePluginRequest} message
     * @param {yak.WebSocketConnection} connection
     */
    function sendPluginAlreadyExistsResponse(message, connection) {
        var response = new yak.api.CreatePluginResponse();
        response.success = false;
        response.message = 'Cannot create plugin: Name \'' + message.name + '\' is already used.';
        connection.send(response);
    }

    /**
     * Send an error response
     * @param {yak.CreatePluginRequest} message
     * @param {yak.WebSocketConnection} connection
     */
    function sendInvalidNameResponse(message, connection) {
        var response = new yak.api.CreatePluginResponse();
        response.success = false;
        response.message = 'Name is not valid.';
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
