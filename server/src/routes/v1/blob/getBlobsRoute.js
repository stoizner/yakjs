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

    blobProvider.getBlobs(space)
        .then(blobNames => {
            const blobs = blobNames.map(name => {
                return {
                    name,
                    link: request.originalUrl + '/' + name
                }
            });

            response.send({space, blobs});
        })
        .catch(error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({error});
        });
}

module.exports = getBlobRoute;
