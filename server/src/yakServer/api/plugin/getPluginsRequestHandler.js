/**
 * GetPluginsRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.RequestHandler}
 */
yak.GetPluginsRequestHandler = function GetPluginsRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.GetPluginsRequest} request
     * @returns {yak.api.GetPluginsResponse} response
     */
    this.handle = function handle(request) {
        var plugins = yakServer.pluginManager.getPlugins();

        var response = new yak.api.GetPluginsResponse(request.id);

        _.each(plugins, function toPluginInfo(plugin) {
            var pluginInfo = new yak.api.PluginInfo();

            pluginInfo.id = plugin.id;
            pluginInfo.name = plugin.id;

            pluginInfo.description = plugin.description;
            pluginInfo.code = plugin.code;
            pluginInfo.version = plugin.version;

            response.plugins.push(pluginInfo);
        });

        return response;
    };
};
