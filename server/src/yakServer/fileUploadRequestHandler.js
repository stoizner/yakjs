/**
 * FileUploadRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.FileUploadRequestHandler = function FileUploadRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.CreateInstanceConfigRequestHandler}
     */
    var self = this;

    var INTERNAL_ERROR_MESSAGE = 'Internal YAKjs error. To help us, please report that problem.';

    var PLUGIN_EXTENSION = '.plugin.js';
    var PLUGIN_EXTENSION_OLD = '.js';
    var INSTANCE_EXTENSION = '.instance.json';
    var STORE_EXTENSION = '.store.txt';
    var STORE_EXTENSION_OLD = '.txt';

    /**
     * @type {yak.Store}
     */
    var store = yak.require('store');

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {yak.api.PluginValidator}
     */
    var pluginValidator = new yak.api.PluginValidator();

    /**
     * @param {yak.api.UploadFileRequest} request
     * @returns {!yak.api.UploadFileResponse} response
     */
    this.handle = function handle(request) {
        var response;

        if (isPlugin(request.filename)) {
            log.info('Handle plugin upload.', {filename:request.filename});
            response = addOrUpdatePlugin(request);
        } else if (isInstance(request.filename)) {
            log.info('Handle instance upload.', {filename:request.filename});
            response = addOrUpdateInstance(request);
        } else if (isStore(request.filename)) {
            log.info('Handle store upload.', {filename:request.filename});
            response = addOrUpdateStore(request);
        } else {
            log.info('Handle unknown file. ', {filename:request.filename});
            response = new yak.api.UploadFileResponse(request.id);
            response.success = false;
            response.message = 'Unknown file type. ' + request.filename;
        }

        return response;
    };

    /**
     * @param {yak.api.UploadFileRequest} request
     * @returns {!yak.api.UploadFileResponse} response
     */
    function addOrUpdateStore(request) {
        var response = new yak.api.UploadFileResponse(request.id);

        try {
            var documentKey = request.filename.replace(STORE_EXTENSION, '');
            documentKey = documentKey.replace(STORE_EXTENSION_OLD, '');

            store.setValue(documentKey, request.content);

            if (request.enableInstanceRestart) {
                // Restart every instance, because currently there is no way
                // to determine which plugin uses a store key.
                var instances = yakServer.instanceManager.getInstances();
                _.each(instances, function restart(instance) {
                    restartInstance(instance.id);
                });
            }

            response.success = true;
        } catch(ex) {
            log.warn(ex);
            response.success = false;
            response.message = INTERNAL_ERROR_MESSAGE;
        }

        return response;
    }

    /**
     * @param {yak.api.UploadFileRequest} request
     * @returns {!yak.api.UploadFileResponse} response
     */
    function addOrUpdateInstance(request) {
        var response = new yak.api.UploadFileResponse(request.id);

        try {
            var instance = yakServer.instanceManager.parseInstance(request.filename, request.content);

            if (instance) {
                yakServer.instanceManager.addOrUpdateInstance(instance);
            } else {
                response.success = false;
                response.message = 'Instance configuration json is not valid. ';
            }
        } catch(ex) {
            log.warn(ex);
            response.success = false;
            response.message = INTERNAL_ERROR_MESSAGE;
        }

        return response;
    }

    /**
     * @param {yak.api.UploadFileRequest} request
     * @returns {!yak.api.UploadFileResponse} response
     */
    function addOrUpdatePlugin(request) {
        var response = new yak.api.UploadFileResponse(request.id);

        try {
            var pluginManager = yakServer.pluginManager;

            var pluginName = request.filename.replace(PLUGIN_EXTENSION, '');
            pluginName = pluginName.replace(PLUGIN_EXTENSION_OLD, '');

            var parsedPlugin = pluginManager.parsePluginContent(pluginName, request.content);

            if (pluginValidator.isPluginValid(parsedPlugin)) {
                parsedPlugin.version = parsedPlugin.version || '0.1.0';
                parsedPlugin.description = parsedPlugin.description || 'Created via file upload ' + request.filename;

                pluginManager.addOrUpdatePlugin(parsedPlugin);
                pluginManager.savePlugin(parsedPlugin);

                if (request.enableInstanceRestart) {
                    restartInstancesWithPlugin(parsedPlugin.name);
                }
            } else {
                response.success = false;
                response.message = pluginValidator.getMessage();
            }
        } catch(ex) {
            log.warn(ex);
            response.success = false;
            response.message = INTERNAL_ERROR_MESSAGE;
        }
        return response;
    }

    /**
     * @param {string} pluginName
     */
    function restartInstancesWithPlugin(pluginName) {
        var instances = yakServer.instanceManager.getInstances();

        /**
         * @param {yak.Instance} instance
         */
        function restartWhenUsingPlugin(instance) {
            if (_.contains(instance.plugins, pluginName)) {
                restartInstance(instance.id);
            }
        }

        _.each(instances, restartWhenUsingPlugin);
    }

    /**
     * Restart instance
     * @param {string} instanceId
     */
    function restartInstance(instanceId) {
        var instanceEntity = yakServer.instanceManager.getInstanceEntity(instanceId);
        instanceEntity.stop();
        instanceEntity.start();
    }

    /**
     * Whether this file is a plugin.
     * @param {string} filename
     * @returns {boolean} Whether this file is a plugin.
     */
    function isPlugin(filename) {
        return (hasExtension(filename, PLUGIN_EXTENSION) || hasExtension(filename, PLUGIN_EXTENSION_OLD));
    }

    /**
     * Whether this file is a instance.
     * @param {string} filename
     * @returns {boolean} Whether this file is a instance.
     */
    function isInstance(filename) {
        return hasExtension(filename, INSTANCE_EXTENSION);
    }

    /**
     * Whether this file is a store.
     * @param {string} filename
     * @returns {boolean} Whether this file is a store.
     */
    function isStore(filename) {
        return hasExtension(filename, STORE_EXTENSION) || hasExtension(filename, STORE_EXTENSION_OLD);
    }

    /**
     * @param {string} filename
     * @param {string} extension
     * @returns {boolean} Whether a filename has a specific extension.
     */
    function hasExtension(filename, extension) {
        var extensionIndex = filename.lastIndexOf(extension);
        var hasFilenameExtension = (extensionIndex > 0 && extensionIndex === (filename.length - extension.length));
        return hasFilenameExtension;
    }
};
