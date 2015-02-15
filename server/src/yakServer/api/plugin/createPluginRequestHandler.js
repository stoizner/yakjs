/**
 * CreatePluginRequestHandler
 * @constructor
 * @param {yak.YakServer} yakjs
 * @implements {yak.RequestHandler}
 */
yak.CreatePluginRequestHandler = function CreatePluginRequestHandler(yakjs) {
    'use strict';

    /**
     * @type {yak.PluginCodeChecker}
     */
    var pluginCodeChecker = new yak.PluginCodeChecker();

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
        if (request.name === null || request.name === '') {
            log.warn('Invalid plugin name', {name: request.name});
            response = createInvalidNameResponse(request);
        } else {
            var pluginId = request.name.replace('.plugin', '');
            var plugin = yakjs.pluginManager.getPlugin(pluginId);

            if (plugin) {
                log.warn('Plugin already exists.', {id: pluginId});
                response = createPluginAlreadyExistsResponse(request);
            } else {
                var codeCheck = pluginCodeChecker.checkCode(request.code);

                if (codeCheck.isValid) {
                    var newPlugin = null;

                    if (yakjs.pluginManager.hasJsDoc(request.code)) {
                        newPlugin = yakjs.pluginManager.parsePluginContent(pluginId, request.code);
                    } else {
                        newPlugin = new yak.Plugin();
                        newPlugin.id = pluginId;
                        newPlugin.name = pluginId;
                        newPlugin.version = request.version;
                        newPlugin.description = request.description;
                        newPlugin.code = request.code;
                    }

                    yakjs.pluginManager.addPlugin(newPlugin);
                    yakjs.pluginManager.savePlugin(newPlugin);

                    response = new yak.api.CreatePluginResponse(request.id);
                } else {
                    log.warn('Plugin code is not valid.', {codeCheck: codeCheck});
                    response = createInvalidCodeResponse(request, codeCheck);
                }
            }
        }

        return response;
    };

    /**
     * Send an error response.
     * @param {yak.CreatePluginRequest} request
     * @returns {!yak.api.CreatePluginResponse} response
     */
    function createPluginAlreadyExistsResponse(request) {
        var response = new yak.api.CreatePluginResponse(request.id);
        response.success = false;
        response.message = 'Cannot create plugin: Name \'' + request.name + '\' is already used.';

        return response;
    }

    /**
     * Send an error response.
     * @param {yak.CreatePluginRequest} request
     * @returns {!yak.api.CreatePluginResponse} response
     */
    function createInvalidNameResponse(request) {
        var response = new yak.api.CreatePluginResponse(request.id);
        response.success = false;
        response.message = 'Name is not valid.';

        return response;
    }

    /**
     * Send an error response.
     * @param {yak.CreatePluginRequest} request
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
