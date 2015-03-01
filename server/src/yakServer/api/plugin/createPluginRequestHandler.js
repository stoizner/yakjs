/**
 * CreatePluginRequestHandler
 * @constructor
 * @param {yak.YakServer} yakjs
 * @implements {yak.RequestHandler}
 */
yak.CreatePluginRequestHandler = function CreatePluginRequestHandler(yakjs) {
    'use strict';

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(this.constructor.name);

    /**
     * @param {yak.api.CreatePluginRequest} request
     * @returns {!yak.api.CreatePluginResponse} response
     */
    this.handle = function handle(request) {
        var response;
        var pluginValidator = new yak.api.PluginValidator(yakjs.pluginManager);

        if (pluginValidator.isCreatePluginRequestValid(request)) {
            var newPlugin = null;

            if (yakjs.pluginManager.hasJsDoc(request.code)) {
                newPlugin = yakjs.pluginManager.parsePluginContent(request.name, request.code);
            } else {
                newPlugin = new yak.Plugin();
                newPlugin.id = request.name;
                newPlugin.name = request.name;
                newPlugin.version = request.version;
                newPlugin.description = request.description;
                newPlugin.code = request.code;
            }

            yakjs.pluginManager.addPlugin(newPlugin);
            yakjs.pluginManager.savePlugin(newPlugin);

            response = new yak.api.CreatePluginResponse(request.id);
        } else {
            response = new yak.api.CreatePluginResponse(request.id);
            response.success = false;
            response.message = pluginValidator.getMessage();
        }

        return response;
    };
};
