/**
 * FileUploadRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.FileUploadRequestHandler = function FileUploadRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.CreateInstanceRequestHandler}
     */
    var self = this;

    var PLUGIN_EXTENSION = '.plugin.js';
    var INSTANCE_EXTENSION = '.instance.json';
    var STORE_EXTENSION = '.store.txt';

    /**
     * @type {yak.PluginManager}
     */
    var pluginManager = yakServer.pluginManager;

    /**
     * @type {yak.Store}
     */
    var store = yak.require('store');

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
    * @param {yak.api.UploadFileRequest} request
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(request, connection) {
        try {
            if (isPlugin(request.filename)) {
                log.info('isPlugin');
                addOrUpdatePlugin(request, connection);
            }

            if (isInstance(request.filename)) {
                addOrUpdateInstance(request, connection);
            }

            if (isStore(request.filename)) {
                addOrUpdateStore(request, connection);
            }
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };

    /**
     * @param {yak.api.UploadFileRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    function addOrUpdateStore(request, connection) {
        var response = new yak.api.UploadFileResponse(request.id);
        response.success = true;

        var storeKey = request.filename.replace(STORE_EXTENSION, '');
        store.setValue(storeKey, request.content);

        // Restart every instance, because currently there is no way
        // to determine which plugin uses a store key.
        var instances = yakServer.instanceManager.getInstances();
        _.each(instances, function restart(instance) { restartInstance(instance.id); });

        connection.send(response);
    }

    /**
     * @param {yak.api.UploadFileRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    function addOrUpdateInstance(request, connection) {
        var response = new yak.api.UploadFileResponse(request.id);
        response.success = false;

        var instance =  yakServer.instanceManager.parseInstance(request.filename, request.content);

        if (instance) {
            if (request.enableInstanceRestart) {
                restartInstance(instance.id);
            }
            response.success = true;
        }

        connection.send(response);
    }

    /**
     * @param {yak.api.UploadFileRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    function addOrUpdatePlugin(request, connection) {
        var response = new yak.api.UploadFileResponse(request.id);
        response.success = false;

        if (pluginManager.hasJsDoc(request.content)) {
            try {
                var parsedPlugin = pluginManager.parsePluginContent(request.filename, request.content);
                console.warn(parsedPlugin);

                pluginManager.addOrUpdatePlugin(parsedPlugin);
                response.success = true;

                if (request.enableInstanceRestart) {
                    restartInstancesWithPlugin(parsedPlugin.name);
                }
            } catch (ex) {
                response.success = false;
                response.message = 'Add or update plugin failed: ' + ex.message;
                console.warn(ex);
            }
        } else {
            response.success = false;
            response.message = 'JsDoc not found. Every plugin file must start with a valid JsDoc documentation.';
        }

        connection.send(response);
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
        return filename.lastIndexOf(PLUGIN_EXTENSION) === (filename.length - PLUGIN_EXTENSION.length);
    }

    /**
     * Whether this file is a instance.
     * @param {string} filename
     * @returns {boolean} Whether this file is a instance.
     */
    function isInstance(filename) {
        return filename.lastIndexOf(INSTANCE_EXTENSION) === (filename.length - INSTANCE_EXTENSION.length);
    }

    /**
     * Whether this file is a store.
     * @param {string} filename
     * @returns {boolean} Whether this file is a store.
     */
    function isStore(filename) {
        return filename.lastIndexOf(STORE_EXTENSION) === (filename.length - STORE_EXTENSION.length);
    }
};
