/**
 * The web server for the YAKjs UI.
 * @constructor
 * @param {!yak.YakServer} yakServer
 * @param {!yak.Config} config
 */
yak.HttpServer = function HttpServer(yakServer, config) {
    'use strict';

    /**
     * @type {yak.HttpServer}
     */
    var self = this;

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {yak.Logger}
     */
    var console = new yak.Logger(self.constructor.name + '.console');

    var express = require('express');
    var http = require('http');
    var path = require('path');
    var bodyParser = require('body-parser');

    var app = express();

    /**
     * @type {Object<string, Object>}
     */
    var apiMap = {};

    /**
     * Constructor
     */
    function constructor() {
        initializeAPIMap();
    }

    /**
     * Start listening.
     */
    this.start = function start() {
        try {
            app.set('port', config.httpPort);
            app.use(express.static(path.join('./ui/')));
            app.use(bodyParser.json({limit: '10MB'}));

            app.get('/scripts/yakjs-ui-config.js', getUIConfig);
            app.get('/api/*', handleAPIRequest);
            app.post('/api/*', handleAPIRequest);

            process.on('uncaughtException', function handleUncaughtException(error) {
                log.error('uncaughtException', error);

                if (error.errno === 'EADDRINUSE') {
                    displayErrorMessage('Port (' + error.port + ') is already in use by another server or service.');
                } else {
                    displayErrorMessage('Unexpected error ' + error.errno);
                }
            });

            http.createServer(app).listen(app.get('port'), function listen(){
                console.info('.........................................................................');
                console.info('YAKjs server initialized and running on http port ' + config.httpPort);
                console.info('.........................................................................');
                console.info('');
                console.info('See ./log/yakjs.log for errors and warnings.');
                console.info('Use --debug to display all log messages in the console.');
                console.info('');
                console.info('Press CTRL + C to stop YAKjs.');
            });
        } catch(ex) {
            displayErrorMessage(ex.message);
        }
    };

    /**
     * Displays the error message block to the console.
     * @param {string} message
     */
    function displayErrorMessage(message) {
        console.info('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.warn('Could not start YAKjs server on http port' + config.httpPort);
        console.info('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.info('');
        console.info('Error: ' + message);
        console.info('');
        console.info('See ./log/yakjs.log for more technical details.');
    }

    /**
     * @route /api/
     * @param {ExpressRequest} request The HTTP request.
     * @param {ExpressResponse} response The HTTP response object.
     */
    function handleAPIRequest(request, response) {
        var identfiers = JSON.stringify(findIdentifiers(request.body));
        var requestLogMessage = ['api', '>', request.body.type, ':', identfiers].join(' ');
        log.info(requestLogMessage);

        var requestType =  request.body.type;
        var apiResponse = '';

        if (apiMap[requestType]) {
             apiResponse = apiMap[requestType].handle(request.body);
        }

        var responseLogMessage = ['api', '<', apiResponse.type, (apiResponse.success ? 'success' : 'error')].join(' ');

        if (apiResponse.success) {
            log.info(responseLogMessage);
        } else {
            log.warn(responseLogMessage);
        }

        response.send(apiResponse);
    }

    /**
     * Find properties that may be used to identify the object like 'Id', 'Key'
     * or a combination of it 'pluginId', 'instanceId'
     * @param {Object} obj
     * @returns {Object} An object with only the found identifier values.
     */
    function findIdentifiers(obj) {
        var identifierKeys = Object.keys(obj).filter(function isUsedToIdentifySomething(key) {
            var lowerKey = key.toLowerCase();
            return (
                lowerKey.indexOf('key') === 0 ||
                key.indexOf('Key') >= 0 ||
                lowerKey.indexOf('id') === 0 ||
                key.indexOf('Id') >= 0
            );
        });

        var identifiers = {};

        identifierKeys.forEach(function mapId(idKey) {
            identifiers[idKey] = obj[idKey];
        });

        return identifiers;
    }

    /**
     * @route /scripts/yakjs-ui-config.js
     * @param {ExpressRequest} request The HTTP request.
     * @param {ExpressResponse} response The HTTP response object.
     */
    function getUIConfig(request, response) {
        var uiConfig = {
            webSocketUri: ['ws://', request.hostname, ':', config.servicePort].join('')
        };

        response.send(['var yak = yak || {}; yak.config = ', JSON.stringify(uiConfig), ';\n'].join(''));
    }

    /**
     * Initialize Mapping between request type and handler.
     */
    function initializeAPIMap() {
        // Instance
        apiMap['request.startInstance'] = new yak.StartInstanceRequestHandler(yakServer);
        apiMap['request.stopInstance'] = new yak.StopInstanceRequestHandler(yakServer);
        apiMap['request.getInstances'] = new yak.GetInstancesRequestHandler(yakServer.instanceManager);

        // Instance Configs
        apiMap['request.createInstanceConfig'] = new yak.CreateInstanceConfigRequestHandler(yakServer.instanceManager.configProvider, yakServer.instanceManager);
        apiMap['request.updateInstanceConfig'] = new yak.UpdateInstanceConfigRequestHandler(yakServer.instanceManager.configProvider, yakServer.instanceManager);
        apiMap['request.deleteInstanceConfig'] = new yak.DeleteInstanceConfigRequestHandler(yakServer.instanceManager.configProvider, yakServer.instanceManager);

        // Plugin
        apiMap['request.getPlugins'] = new yak.GetPluginsRequestHandler(yakServer);
        apiMap['request.createOrUpdatePlugin'] = new yak.CreateOrUpdatePluginRequestHandler(yakServer);
        apiMap['request.deletePlugin'] = new yak.DeletePluginRequestHandler(yakServer);

        // Store
        apiMap['yak.api.GetStoreKeysRequest'] = new yak.GetStoreKeysRequestHandler(yakServer);
        apiMap['yak.api.GetStoreItemRequest'] = new yak.GetStoreItemRequestHandler(yakServer);
        apiMap['yak.api.SetStoreItemRequest'] = new yak.SetStoreItemRequestHandler(yakServer);
        apiMap['yak.api.DeleteStoreItemRequest'] = new yak.DeleteStoreItemRequestHandler(yakServer);

        // File Upload
        apiMap['request.uploadFileRequest'] = new yak.FileUploadRequestHandler(yakServer);
    }

    constructor();
};
