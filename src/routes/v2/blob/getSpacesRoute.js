'use strict';

const HttpStatus = require('http-status-codes');
const blobProvider = require('../../../blob/blobProvider');

/**
 * @param request
 * @param response
 */
function getSpacesRoute(request, response) {
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

module.exports = getSpacesRoute;
