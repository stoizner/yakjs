'use strict';

const fs = require('fs-extra');
const HttpStatus = require('http-status-codes');
const getCurrentPluginsDirectory = require('../../../infrastructure/getCurrentPluginsDirectory');
const installPluginModules = require('../../../infrastructure/installPluginModules');
const log = require('../../../infrastructure/logger').defaultLogger;

/**
 * @param request
 * @param response
 */
function postPluginsPackageJsonRoute(request, response) {
    /**
     * @type {!Object}
     */
    const packageJson = request.body;

    const pluginDir = getCurrentPluginsDirectory();

    fs.writeJson(pluginDir + '/package.json', packageJson)
        .then(() => installPluginModules())
        .then(() => response.send())
        .catch(error => {
            log.error('Could not update or install plugin modules.', error);
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        });
}

module.exports = postPluginsPackageJsonRoute;
