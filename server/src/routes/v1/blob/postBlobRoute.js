'use strict';

const blobProvider = require('../../../blob/blobProvider');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function postBlobRoute(request, response) {
    /**
     * @type {string}
     */
    const space = request.params.space;

    /**
     * @type {string}
     */
    const name = request.params.name;

    blobProvider
        .write(space, name, request.body)
        .then(() => {
            response.send();
        })
        .catch(error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({error});
        });
}

module.exports = postBlobRoute;
