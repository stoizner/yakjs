/**
 * DeletePluginRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.RequestHandler}
 */
yak.DeletePluginRequestHandler = function DeletePluginRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.DeletePluginRequest} request
     * @returns {!yak.api.DeletePluginResponse} response
     */
    this.handle = function handle(request) {
        var pluginId = request.pluginName.replace('.plugin', '');
        var plugin = yakServer.pluginManager.getPlugin(pluginId);
        var response;

        if (plugin) {
            yakServer.pluginManager.removePlugin(pluginId);
            response = new yak.api.DeletePluginResponse(request.id);
        } else {
            response = new yak.api.DeletePluginResponse(request.id);
            response.success = false;
            response.message = 'Can not find plugin: ' + request.pluginName;
        }

        return response;
    };
};
