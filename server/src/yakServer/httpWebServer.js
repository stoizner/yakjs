/**
 * The web server for the yakjs UI.
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

    var express = require('express');
    var http = require('http');
    var path = require('path');
    var bodyParser = require('body-parser');

    var app = express();

    /**
     * @type {Object.<string, Object>}
     */
    var apiMap = {};

    /**
     * Constructor
     */
    function constructor() {
        log.debug('ctor()');
        initializeAPIMap();
    }

    /**
     * Start listening.
     */
    this.start = function start() {
        try {
            app.set('port', config.httpPort);
            app.use(express.static(path.join('./ui/')));
            app.use(bodyParser.json());

            app.get('/scripts/yakjs-ui-config.js', getUIConfig);
            app.get('/api/*', handleAPIRequest);
            app.post('/api/*', handleAPIRequest);

            http.createServer(app).listen(app.get('port'), function listen(){
                log.info('YAKjs HTTP server running.', {httpPort: config.httpPort});
            });
        } catch(ex) {
            log.warn('Could not start YAKjs HTTP server.', {httpPort: config.httpPort});
        }
    };

    /**
     * @route /api/
     * @param {ExpressRequest} request The HTTP request.
     * @param {ExpressResponse} response The HTTP response object.
     */
    function handleAPIRequest(request, response) {
        log.info('api > ' + request.body.type + '  ' + request.body.id);

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
        apiMap['request.restartInstance'] = new yak.RestartInstanceRequestHandler(yakServer);
        apiMap['request.getInstances'] = new yak.GetInstancesRequestHandler(yakServer);
        apiMap['request.createInstance'] = new yak.CreateInstanceRequestHandler(yakServer);
        apiMap['request.updateInstance'] = new yak.UpdateInstanceRequestHandler(yakServer);
        apiMap['request.removeInstance'] = new yak.DeleteInstanceRequestHandler(yakServer);

        // Plugin
        apiMap['request.getPlugins'] = new yak.GetPluginsRequestHandler(yakServer);
        apiMap['request.createPlugin'] = new yak.CreatePluginRequestHandler(yakServer);
        apiMap['request.createOrUpdatePlugin'] = new yak.CreateOrUpdatePluginRequestHandler(yakServer);
        apiMap['request.deletePlugin'] = new yak.DeletePluginRequestHandler(yakServer);
        apiMap['request.updatePlugin'] = new yak.UpdatePluginRequestHandler(yakServer);

        // Log
        apiMap['request.getLogInfo'] = new yak.GetLogInfoRequestHandler(yakServer);

        // Store
        apiMap['request.getStoreKeyInfo'] = new yak.GetStoreKeyInfoRequestHandler(yakServer);
        apiMap['request.getStoreValue'] = new yak.GetStoreValueRequestHandler(yakServer);
        apiMap['request.setStoreValue'] = new yak.SetStoreValueRequestHandler(yakServer);
        apiMap['request.deleteStoreItem'] = new yak.DeleteStoreItemRequestHandler(yakServer);

        // File Upload
        apiMap['request.uploadFileRequest'] = new yak.FileUploadRequestHandler(yakServer);
    }

    constructor();
};
