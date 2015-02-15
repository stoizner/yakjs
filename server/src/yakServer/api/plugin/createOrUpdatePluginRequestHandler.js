/**
 * CreateOrUpdatePluginRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.RequestHandler}
 */
yak.CreateOrUpdatePluginRequestHandler = function CreateOrUpdatePluginRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.PluginCodeChecker}
     */
    var pluginCodeChecker = new yak.PluginCodeChecker();

    /**
     * @param {yak.api.CreateOrUpdatePluginRequest} request
     * @returns {!yak.api.UpdatePluginResponse|!yak.api.CreatePluginResponse} response
     */
    this.handle = function handle(request) {
        var pluginId = request.name.replace('.plugin', '');
        var plugin = yakServer.pluginManager.getPlugin(pluginId);
        var response;

        if (plugin) {
            response = updatePlugin(request);
        } else {
            response = createPlugin(request);
        }

        return response;
    };

    /**
     * Update existing Plugin
     * @param {!yak.api.CreateOrUpdatePluginRequest} request
     * @returns {!yak.api.UpdatePluginResponse} response
     */
    function updatePlugin(request) {
        var updatePluginRequest = new yak.api.UpdatePluginRequest();
        updatePluginRequest.pluginName = request.name;
        updatePluginRequest.name = request.name;
        updatePluginRequest.code = request.code;
        updatePluginRequest.description = request.description;
        updatePluginRequest.version = request.version;

        var updateHandler = new yak.UpdatePluginRequestHandler(yakServer);
        return updateHandler.handle(updatePluginRequest);
    }

    /**
     * CreatePlugin
     * @param {!yak.api.CreateOrUpdatePluginRequest} request
     * @returns {!yak.api.CreatePluginResponse} response
     */
    function createPlugin(request) {
        var createPluginRequest = new yak.api.CreatePluginRequest();
        createPluginRequest.name = request.name;
        createPluginRequest.code = request.code;
        createPluginRequest.description = request.description;
        createPluginRequest.version = request.version;

        var createHandler = new yak.CreatePluginRequestHandler(yakServer);
        return createHandler.handle(createPluginRequest);
    }
};
