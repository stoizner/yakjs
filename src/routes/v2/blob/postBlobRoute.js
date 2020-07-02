'use strict';

import blobProvider from '../../../blob/blobProvider';
import HttpStatus from 'http-status-codes';

/**
 * @param request
 * @param response
 */
export function postBlobRoute(request, response) {
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
