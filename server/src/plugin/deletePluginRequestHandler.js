/**
 * @constructor
 * @param {yak.YakServer} yakServer
 */
yak.DeletePluginRequestHandler = function DeletePluginRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.DeletePluginRequest} request
     * @returns {!yak.api.DeletePluginResponse} response
     */
    this.handle = function handle(request) {
        var plugin = yakServer.pluginManager.getPlugin(request.pluginId);
        var response = new yak.api.DeletePluginResponse(request.id);

        if (plugin) {
            yakServer.pluginManager.removePlugin(request.pluginId);
        } else {
            response.success = false;
            response.message = 'Can not find plugin: ' + request.pluginId;
        }

        return response;
    };
};
