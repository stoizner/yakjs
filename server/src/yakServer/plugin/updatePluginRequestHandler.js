/**
 * UpdatePluginRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.RequestHandler}
 */
yak.UpdatePluginRequestHandler = function UpdatePluginRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(this.constructor.name);

    /**
     * @param {yak.api.UpdatePluginRequest} request
     * @returns {!yak.api.UpdatePluginResponse} response
     */
    this.handle = function handle(request) {
        var originalPluginId = request.pluginName.replace('.plugin', '');
        var pluginId = request.name.replace('.plugin', '');
        var pluginManager = yakServer.pluginManager;

        var plugin = pluginManager.getPlugin(originalPluginId);
        var response;
        var pluginValidator = new yak.api.PluginValidator(yakServer.pluginManager);

        if (pluginValidator.isUpdatePluginRequestValid(request)) {
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

            response = new yak.api.UpdatePluginResponse(request.id);

        } else {
            response = new yak.api.CreatePluginResponse(request.id);
            response.success = false;
            response.message = pluginValidator.getMessage();
        }

        return response;
    };
};
