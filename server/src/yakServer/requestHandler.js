/**
 * RequestHandler
 * @interface
 */
yak.RequestHandler = function RequestHandler() {
    'use strict';

    /**
     * @param {object} message
     * @returns {!yak.api.Response} response
     */
    this.handle = function handle(message) {
        return new yak.api.Response();
    };
};
