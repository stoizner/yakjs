/**
 * FileUploadRequestHandler
 * @constructor
 * @param {!yak.YakServer} yakServer
 */
yak.FileUploadRequestHandler = function FileUploadRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.CreateInstanceConfigRequestHandler}
     */
    var self = this;

    var INTERNAL_ERROR_MESSAGE = 'Unknown internal YAKjs error.';

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
        response.fileType = 'store';

        try {
            var documentKey = request.filename.replace(STORE_EXTENSION, '');
            documentKey = documentKey.replace(STORE_EXTENSION_OLD, '');

            store.setValue(documentKey, request.content);

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
        response.fileType = 'instance';

        try {
            var instance = yakServer.instanceManager.parseInstance(request.filename, request.content);

            if (instance) {
                yakServer.instanceManager.createInstance(instance);
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
        response.fileType = 'plugin';

        try {
            var pluginParser = new yak.PluginParser();
            var pluginManager = yakServer.pluginManager;

            var pluginName = request.filename.replace(PLUGIN_EXTENSION, '');
            pluginName = pluginName.replace(PLUGIN_EXTENSION_OLD, '');

            var parsedPlugin = pluginParser.parse(pluginName, request.content);

            if (pluginValidator.isPluginValid(parsedPlugin)) {
                parsedPlugin.version = parsedPlugin.version || '0.1.0';
                parsedPlugin.description = parsedPlugin.description || 'Created via file upload ' + request.filename;

                pluginManager.addOrUpdatePlugin(parsedPlugin);
                pluginManager.savePlugin(parsedPlugin);

                response.affectedInstanceIds = yakServer
                    .instanceManager
                    .configProvider
                    .getInstanceConfigsByPlugin(parsedPlugin.id)
                    .map(function toId(instanceConfig) {
                        return instanceConfig.id;
                    });
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
