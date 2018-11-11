'use strict';

const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const Logger = require('./infrastructure/logger');
const apiV1Router = require('./routes/v1/apiV1Router');
const httpsServerOptionsProvider = require('./config/httpsServerOptionsProvider');

/**
 * @constructor
 * @struct
 * @param {!Config} config
 */
function ExpressServer(config) {
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

    function constructor() {
        process.on('uncaughtException', function handleUncaughtException(error) {
            if (error.errno === 'EADDRINUSE') {
                displayErrorMessage('Port (' + error.port + ') is already in use by another server or service.');
            } else {
                displayErrorMessage('Unexpected error ' + error.errno);
                log.error('uncaughtException', error);
            }
        });
    }

    /**
     * Start listening.
     */
    this.start = function start() {
        try {
            app.set('port', config.httpPort);

            let rootPath = path.join(__dirname, '../', config.frontendFolder);
            console.debug('Serving YAKjs UI from', {rootPath});
            app.use(express.static(rootPath));

            config.staticRoutes.forEach(route => {
                console.debug('Serving custom static route', {route});
                app.use('/' + route.name + '/', express.static(route.path));
            });

            app.use(bodyParser.json({limit: '10MB'}));
            app.use(bodyParser.text({type: 'text/*', limit: '10MB'}));
            app.use(bodyParser.raw({type: '*/*', limit: '100MB'}));

            app.get('/scripts/yakjs-ui-config.js', getUIConfig);

            app.use('/v1/', apiV1Router);

            // YAKjs does not implement any authentication, so listen only to localhost (IPv4) and [::1] (IPv6)

            let restrictedToHostname = 'localhost';

            if (process.env.YAKJS_NO_LOCALHOST_RESTRICTION) { // eslint-disable-line no-process-env
                console.warn('No localhost hostname restriction active. All connections will be accepted.');
                restrictedToHostname = null;
            }

            if (config.useSecureConnection) {
                https.createServer(httpsServerOptionsProvider.options, app).listen(app.get('port'), restrictedToHostname, displayWelcomeMessage);
                https.createServer(httpsServerOptionsProvider.options, app).on('error', () => {
                    console.info('Not listening on IPV6 interface.');
                }).listen(app.get('port'), '[::1]');
            } else {
                http.createServer(app).listen(app.get('port'), restrictedToHostname, displayWelcomeMessage);

                http.createServer(app).on('error', () => {
                    console.info('Not listening on IPV6 interface.');
                }).listen(app.get('port'), '[::1]');
            }
        } catch (ex) {
            displayErrorMessage(ex.message);
        }
    };

    /**
     * Displays the welcome message to the console.
     */
    function displayWelcomeMessage() {
        var protocol = config.useSecureConnection ? 'HTTPS' : 'HTTP';

        console.info('.........................................................................');
        console.info('YAKjs server initialized and running on ' + protocol + ' port: ' + config.httpPort);
        console.info('.........................................................................');
        console.info('');
        console.info('See ./logs/yakjs.log for errors and warnings.');
        console.info('');
        console.info('Press CTRL + C to stop YAKjs.');
    }

    /**
     * Displays the error message block to the console.
     * @param {string} message
     */
    function displayErrorMessage(message) {
        var protocol = config.useSecureConnection ? 'HTTPS' : 'HTTP';

        console.error('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.error('Could not start YAKjs server on ' + protocol + ' port: ' + config.httpPort);
        console.error('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.error('');
        console.error('Error: ' + message);
        console.error('');
        console.error('See ./logs/yakjs.log for more technical details.');
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

    constructor();
}

module.exports = ExpressServer;
