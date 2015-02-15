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
     * @returns {!yak.api.CreatePluginResponse} response
     */
    this.handle = function handle(request) {
        var originalPluginId = request.pluginName.replace('.plugin', '');
        var pluginManager = yakServer.pluginManager;

        var plugin = pluginManager.getPlugin(originalPluginId);
        var response;

        /**
         * @type {yak.PluginCodeChecker}
         */
        var pluginCodeChecker = new yak.PluginCodeChecker();

        if (plugin) {
            var codeCheck = pluginCodeChecker.checkCode(request.code);

            if (codeCheck.isValid) {
                var pluginId = request.name.replace('.plugin', '');

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
                log.warn('Can not update plugin. Code is not valid.', {id: originalPluginId, codeCheck: codeCheck});
                response = createInvalidCodeResponse(request, codeCheck);
            }
        } else {
            log.warn('Can not update plugin. Plugin not found.', {id: originalPluginId});
            response = createPluginNotFoundResponse(request);
        }

        return response;
    };

    /**
     * Send an error response
     * @param {yak.api.UpdatePluginRequest} request
     * @param {yak.RemovePluginRequest} message
     * @returns {!yak.api.CreatePluginResponse} response
     */
    function createPluginNotFoundResponse(request, message) {
        var response = new yak.api.DeletePluginResponse(request.id);
        response.success = false;
        response.message = 'Can not find plugin: ' + message.pluginName;

        return response;
    }

    /**
     * Send an error response
     * @param {yak.api.UpdatePluginRequest} request
     * @param {{isValid:boolean, errors:[]}} codeCheck
     * @returns {!yak.api.CreatePluginResponse} response
     */
    function createInvalidCodeResponse(request, codeCheck) {
        var response = new yak.api.CreatePluginResponse(request.id);
        response.success = false;
        response.message = 'Code is not valid: \n';
        response.message += codeCheck.errors.join('\n');

        return response;
    }
};
