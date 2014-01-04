/**
 * CreateOrUpdatePluginRequestHandler
 * @constructor
 * @param {yak.YakServer} cloudServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.CreateOrUpdatePluginRequestHandler = function CreateOrUpdatePluginRequestHandler(cloudServer) {
    'use strict';

    /**
     * @type {yak.PluginCodeChecker}
     */
    var pluginCodeChecker = new yak.PluginCodeChecker();

    /**
     * Constructor
     */
    function constructor() {
    }

    /**
     * @param {yak.api.CreateOrUpdatePluginRequest} message
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(message, connection) {

        try {
            if (cloudServer.pluginManager.hasPlugin(message.name)) {
                updatePlugin(message, connection);
            } else {
                createPlugin(message, connection);
            }
        } catch (ex) {
            cloudServer.serviceInstance.log.error(ex.message);
        }
    };

    /**
     * Update existing Plugin
     * @param {yak.api.CreateOrUpdatePluginRequest} message
     * @param {yak.WebSocketConnection} connection
     */
    function updatePlugin(message, connection) {
        var updatePluginRequest = new yak.api.UpdatePluginRequest();
        updatePluginRequest.pluginName = message.name;
        updatePluginRequest.name = message.name;
        updatePluginRequest.code = message.code;
        updatePluginRequest.description = message.description;

        var updateHandler = new yak.UpdatePluginRequestHandler(cloudServer);
        updateHandler.handle(updatePluginRequest, connection);
    }

    /**
     * CreatePlugin
     * @param {yak.api.CreateOrUpdatePluginRequest} message
     * @param {yak.WebSocketConnection} connection
     */
    function createPlugin(message, connection) {
        var createPluginRequest = new yak.api.CreatePluginRequest();
        createPluginRequest.name = message.name;
        createPluginRequest.code = message.code;
        createPluginRequest.description = message.description;

        var createHandler = new yak.CreatePluginRequestHandler(cloudServer);
        createHandler.handle(createPluginRequest, connection);
    }

    constructor();
};