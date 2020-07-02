'use strict';

import HttpStatus from 'http-status-codes';
import blobProvider from '../../../blob/blobProvider';

/**
 * @param request
 * @param response
 */
export function getBlobRoute(request, response) {
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
