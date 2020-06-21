'use strict';

const HttpStatus = require('http-status-codes');
const blobProvider = require('../../../blob/blobProvider');

/**
 * @param request
 * @param response
 */
function getBlobRoute(request, response) {
    /**
     * @type {string}
     */
    const space = request.params.space;

    /**
     * @type {string}
     */
    const name = request.params.name;

    blobProvider.delete(space, name)
        .then(() => {
            response.send();
        })
        .catch(error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({error});
        });
}

module.exports = getBlobRoute;
