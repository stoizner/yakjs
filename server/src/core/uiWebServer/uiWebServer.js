/**
 * The web server for the yakjs UI.
 * @constructor
 * @param {yak.Config} config
 */
yak.UiWebServer = function UiWebServer(config) {
    'use strict';

    /**
     * @type {yak.UiWebServer}
     */
    var self = this;

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    var express = require('express');
    var http = require('http');
    var path = require('path');

    var app = express();

    /**
     * Start listening.
     */
    this.start = function start() {
        try {
            app.set('port', config.httpPort);
            app.use(express.static(path.join('./ui/')));

            http.createServer(app).listen(app.get('port'), function listen(){
                log.info('Web server for YAKjs UI running.', {httpPort: config.httpPort});
            });
        } catch(ex) {
            log.warn('Could not start Web server for YAKjs UI.', {httpPort: config.httpPort});
        }
    };
};
