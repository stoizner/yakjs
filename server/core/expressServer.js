'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const dns = require('dns');
const Logger = require('./infrastructure/logger');
const apiV1Router = require('./routes/v1/apiV1Router');

/**
 * @constructor
 * @struct
 * @param {!YakServer} yakServer
 * @param {!Config} config
 */
function ExpressServer(yakServer, config) {
    /**
     * @type {ExpressServer}
     */
    let self = this;

    /**
     * @type {!Logger}
     */
    let log = new Logger(self.constructor.name);

    /**
     * @type {!Logger}
     */
    let console = new Logger(self.constructor.name + '.console');

    let app = express();

    /**
     * @type {Object<string, Object>}
     */
    let apiMap = {};

    function constructor() {
        //initializeAPIMap();

        process.on('uncaughtException', function handleUncaughtException(error) {
            log.error('uncaughtException', error);

            if (error.errno === 'EADDRINUSE') {
                displayErrorMessage('Port (' + error.port + ') is already in use by another server or service.');
            } else {
                displayErrorMessage('Unexpected error ' + error.errno);
            }
        });
    }

    /**
     * Start listening.
     */
    this.start = function start() {
        try {
            app.set('port', config.httpPort);
            app.use(express.static(path.join(config.frontendFolder)));
            app.use(bodyParser.json({limit: '10MB'}));

            app.get('/scripts/yakjs-ui-config.js', getUIConfig);

            app.use('/v1/', apiV1Router);

            app.get('/data/store/*', handleGetStoreValueRequest);
            app.post('/data/store/*', handlePostStoreValueRequest);

            // app.get('/api/*', handleAPIRequest);
            // app.post('/api/*', handleAPIRequest);

            // YAKjs does not implement any authentication, so listen only to localhost (IPv4) and [::1] (IPv6)
            http.createServer(app).listen(app.get('port'), 'localhost', displayWelcomeMessage);
            http.createServer(app).listen(app.get('port'), '[::1]');
        } catch(ex) {
            displayErrorMessage(ex.message);
        }
    };

    /**
     * Displays the welcome message to the console.
     */
    function displayWelcomeMessage() {
        console.info('.........................................................................');
        console.info('YAKjs server initialized and running on http port ' + config.httpPort);
        console.info('.........................................................................');
        console.info('');
        console.info('See ./log/yakjs.log for errors and warnings.');
        console.info('Use --debug to display all log messages in the console.');
        console.info('');
        console.info('Press CTRL + C to stop YAKjs.');
    }

    /**
     * Displays the error message block to the console.
     * @param {string} message
     */
    function displayErrorMessage(message) {
        console.error('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.error('Could not start YAKjs server on http port' + config.httpPort);
        console.error('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.error('');
        console.error('Error: ' + message);
        console.error('');
        console.error('See ./log/yakjs.log for more technical details.');
    }

    /**
     * @route /api/
     * @param {ExpressRequest} request The HTTP request.
     * @param {ExpressResponse} response The HTTP response object.
     */
    function handleAPIRequest(request, response) {
        let identfiers = JSON.stringify(findIdentifiers(request.body));
        let requestLogMessage = ['api', '>', request.body.type, ':', identfiers].join(' ');
        log.info(requestLogMessage);

        let requestType =  request.body.type;
        let apiResponse = '';

        if (apiMap[requestType]) {
             apiResponse = apiMap[requestType].handle(request.body);
        }

        let responseLogMessage = ['api', '<', apiResponse.type, (apiResponse.success ? 'success' : 'error')].join(' ');

        if (apiResponse.success) {
            log.info(responseLogMessage);
        } else {
            log.warn(responseLogMessage);
        }

        response.send(apiResponse);
    }

    /**
     * @route /data/store/
     * @param {ExpressRequest} request
     * @param {ExpressResponse} response
     */
    function handleGetStoreValueRequest(request, response) {
        let storeKey = request.url.replace('/data/store/', '');
        let requestLogMessage = ['data/store', '>', 'get', storeKey].join(' ');
        log.info(requestLogMessage);

        if (yakServer.storeProvider.hasValue(storeKey)) {
            let data = yakServer.storeProvider.getValue(storeKey);
            response.status(200).send(data);
            log.info(['get', storeKey, '<', 'ok'].join(' '));
        } else {
            response.sendStatus(404);
            log.info(['get', storeKey, '<', 'nok'].join(' '));
        }
    }

    function handlePostStoreValueRequest(request, response) {
        let storeKey = request.url.replace('/data/store/', '');
        let requestLogMessage = ['data/store', '>', 'post', storeKey].join(' ');
        log.info(requestLogMessage);

        yakServer.storeProvider.updateValue(storeKey, request.body);
        response.status(200).send();
        log.info(['get', storeKey, '<', 'ok'].join(' '));
    }

    /**
     * Find properties that may be used to identify the object like 'Id', 'Key'
     * or a combination of it 'pluginId', 'instanceId'
     * @param {Object} obj
     * @returns {Object} An object with only the found identifier values.
     */
    function findIdentifiers(obj) {
        let identifierKeys = Object.keys(obj).filter(function isUsedToIdentifySomething(key) {
            let lowerKey = key.toLowerCase();
            return (
                lowerKey.indexOf('key') === 0 ||
                key.indexOf('Key') >= 0 ||
                lowerKey.indexOf('id') === 0 ||
                key.indexOf('Id') >= 0
            );
        });

        let identifiers = {};

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
        let uiConfig = {
            webSocketUri: ['ws://', request.hostname, ':', config.servicePort].join('')
        };

        response.send(['var yak = yak || {}; yak.config = ', JSON.stringify(uiConfig), ';\n'].join(''));
    }

    // /**
    //  * Initialize Mapping between request type and handler.
    //  */
    // function initializeAPIMap() {
    //     // Instance
    //     apiMap['request.getInstances'] = new yak.GetInstancesRequestHandler(yakServer);
    //     apiMap['request.restartAllRunningInstances'] = new yak.RestartAllRunningInstancesRequestHandler(yakServer);
    //     apiMap['request.startInstance'] = new yak.StartInstanceRequestHandler(yakServer);
    //     apiMap['request.stopInstance'] = new yak.StopInstanceRequestHandler(yakServer);
    //
    //     // Instance Configs
    //     apiMap['request.createInstanceConfig'] = new yak.CreateInstanceConfigRequestHandler(yakServer.instanceManager.configProvider, yakServer.instanceManager);
    //     apiMap['request.updateInstanceConfig'] = new yak.UpdateInstanceConfigRequestHandler(yakServer.instanceManager.configProvider, yakServer.instanceManager);
    //     apiMap['request.deleteInstanceConfig'] = new yak.DeleteInstanceConfigRequestHandler(yakServer.instanceManager.configProvider, yakServer.instanceManager);
    //
    //     // Plugin
    //     apiMap['request.getPlugins'] = new yak.GetPluginsRequestHandler(yakServer);
    //     apiMap['request.createOrUpdatePlugin'] = new yak.CreateOrUpdatePluginRequestHandler(yakServer);
    //     apiMap['request.deletePlugin'] = new yak.DeletePluginRequestHandler(yakServer);
    //
    //     // Store
    //     apiMap['yak.api.GetStoreKeysRequest'] = new yak.GetStoreKeysRequestHandler(yakServer);
    //     apiMap['yak.api.GetStoreItemRequest'] = new yak.GetStoreItemRequestHandler(yakServer);
    //     apiMap['yak.api.SetStoreItemRequest'] = new yak.SetStoreItemRequestHandler(yakServer);
    //     apiMap['yak.api.DeleteStoreItemRequest'] = new yak.DeleteStoreItemRequestHandler(yakServer);
    //
    //     // Modules
    //     apiMap['request.getModuleNames'] = new yak.GetModuleNamesRequestHandler(yakServer);
    //     apiMap['request.deleteModule'] = new yak.DeleteModuleRequestHandler(yakServer);
    //     apiMap['request.clearModuleCacheRequest'] = new yak.ClearModuleCacheRequestHandler(yakServer);
    //
    //     // File Upload
    //     apiMap['request.uploadFileRequest'] = new yak.FileUploadRequestHandler(yakServer);
    // }

    constructor();
}

module.exports = ExpressServer;
