'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const {createApiRouter} = require('../routes/v2/createApiRouter');

/**
 * @constructor
 * @struct
 * @param {Service} service
 */
function ExpressServer(service) {
    const app = express();

    /**
     * @type {YakServerConfig}
     */
    const {config, log} = service;

    let server = null;

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
    this.start = async function start() {
        app.locals.service = service;

        let frontendPath = path.join(__dirname, '../../', config.frontendFolder);
        log.debug('Serving YAKjs UI from', {frontendPath});

        app.use(express.static(frontendPath));

        app.use(bodyParser.json({limit: '10MB'}));
        app.use(bodyParser.text({type: 'text/*', limit: '10MB'}));
        app.use(bodyParser.raw({type: '*/*', limit: '100MB'}));
        app.use('/v2/', createApiRouter(service));

        await new Promise((resolve, reject) => {
            try {
                server = http.createServer(app);
                server.on('listening', () => {
                    displayWelcomeMessage();
                    resolve();
                });
                server.on('error', reject);
                server.listen(config.port);
            } catch (error) {
                displayErrorMessage(error.message);
                reject(error);
            }
        });
    };

    this.stop = async function stop() {
        if (server) {
            server.close();
        }
    }

    /**
     * Displays the welcome message to the console.
     */
    function displayWelcomeMessage() {
        var protocol = config.useSecureConnection ? 'HTTPS' : 'HTTP';

        console.info('.........................................................................');
        console.info('YAKjs server initialized and running on ' + protocol + ' port: ' + config.port);
        console.info('.........................................................................');
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
        console.error('Could not start YAKjs server on ' + protocol + ' port: ' + config.port);
        console.error('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.error('');
        console.error('Error: ' + message);
        console.error('');
    }

    constructor();
}

module.exports = {ExpressServer};
