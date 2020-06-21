'use strict';

const HttpStatus = require('http-status-codes');
const blobProvider = require('../../../blob/blobProvider');
const mime = require('mime-types');

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

    blobProvider.read(space, name)
        .then(blob => {
            response.type(request.query.contentType || mime.lookup(blob.name));
            response.send(blob.content);
        })
        .catch(error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({error});
        });
}

module.exports = getBlobRoute;
