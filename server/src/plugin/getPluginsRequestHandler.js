/**
 * GetPluginsRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
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

        response.plugins = _.map(plugins, function toPluginConfig(plugin) {
            var pluginConfig = new yak.api.PluginConfig();

            pluginConfig.id = plugin.id;
            pluginConfig.description = plugin.description;
            pluginConfig.code = plugin.code;
            pluginConfig.version = plugin.version;

            return pluginConfig;
        });

        response.plugins = response.plugins.sort(byId);

        return response;
    };

    /**
     * @param {!yak.api.PluginConfig} pluginConfigA
     * @param {!yak.api.PluginConfig} pluginConfigB
     * @returns {number} sortIndex
     */
    function byId(pluginConfigA, pluginConfigB) {
        return pluginConfigA.id.toLowerCase().localeCompare(pluginConfigB.id.toLowerCase());
    }
};
