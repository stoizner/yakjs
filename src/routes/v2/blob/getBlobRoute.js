'use strict';

import HttpStatus from 'http-status-codes';
import blobProvider from '../../../blob/blobProvider';
import mime from 'mime-types';

/**
 * @param request
 * @param response
 */
export function getBlobRoute(request, response) {
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
