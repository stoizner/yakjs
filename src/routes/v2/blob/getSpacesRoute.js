'use strict';

import HttpStatus from 'http-status-codes';
import blobProvider from '../../../blob/blobProvider';

/**
 * @param request
 * @param response
 */
export function getSpacesRoute(request, response) {
    blobProvider.getSpaces()
        .then(spaceNames => {
            const spaces = spaceNames.map(name => {
                return {
                    name,
                    link: request.originalUrl + name
                }
            });

            response.send({spaces});
        })
        .catch(error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({error});
        });
}
