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
            var plugin = yakjs.pluginManager.getPlugin(message.name);

            if (plugin) {
                log.warn('Plugin already exists.', {id: message.name});
                sendPluginAlreadyExistsResponse(message, connection);
            } else {
                if (message.name === null || message.name === '') {
                    sendInvalidNameResponse(message, connection);
                } else {
                    var codeCheck = pluginCodeChecker.checkCode(message.code);

                    if (codeCheck.isValid) {
                        var newPlugin = new yak.Plugin();
                        newPlugin.id = message.name;
                        newPlugin.name = message.name;
                        newPlugin.description = message.description;
                        newPlugin.version = '0.1.0';
                        newPlugin.code = message.code;

                        yakjs.pluginManager.addPlugin(newPlugin);
                        yakjs.pluginManager.savePlugin(newPlugin);
                        sendSuccessResponse(connection);
                    } else {
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
