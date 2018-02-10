'use strict';

const HttpStatus = require('http-status-codes');
const pkg = require('../../../../../package');
const semver = require('semver');
const moment = require('moment');

const npm = require('../../../adapter/npmCliAdapter');

const npmVersion = {
    latestVersion: null,
    checkedVersionAt: null
};

/**
 * @param request
 * @param response
 */
function getVersionRoute(request, response) {
    var versionInfo = {
        version: pkg.version,
        isNewVersionAvailable: false
    };

    return getLastVersion()
        .then(lastReleasedVersion => {
            versionInfo.lastReleasedVersion = lastReleasedVersion;
            versionInfo.isNewVersionAvailable = semver.gt(versionInfo.lastReleasedVersion, versionInfo.version);
        })
        .then(() => response.send(versionInfo))
        .catch(error => response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error));
}

/**
 * @returns {!Promise}
 */
function getLastVersion() {
    let promise;

    // Only request the last version once when YAKjs was started.
    if (npmVersion.latestVersion && npmVersion.checkedVersionAt > yesterday()) {
        promise = Promise.resolve(npmVersion.latestVersion);
    } else {
        npmVersion.checkedVersionAt = moment().valueOf();
        promise = npm
            .show('yakjs')
            .then(info => {
                npmVersion.latestVersion = info['dist-tags'].latest;
                return npmVersion.latestVersion;
            });
    }

    return promise;
}

/**
 * @returns {number}
 */
function yesterday() {
    return moment().add(-1, 'days').valueOf();
}

module.exports = getVersionRoute;
