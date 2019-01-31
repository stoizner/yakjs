'use strict';

const fs = require('fs-extra');
const HttpStatus = require('http-status-codes');
const getCurrentPluginsDirectory = require('../../../infrastructure/getCurrentPluginsDirectory');
const installPluginModules = require('../../../infrastructure/installPluginModules');
const Logger = require('../infrastructure/logger');

/**
 * @param request
 * @param response
 */
function postPluginsPackageJsonRoute(request, response) {
    /**
     * @type {!Logger}
     */
    const log = new Logger('postPluginsPackageJsonRoute');

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
