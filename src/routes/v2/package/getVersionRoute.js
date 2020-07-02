'use strict';

import HttpStatus from 'http-status-codes';
import pkg from '../../../../package.json';
import semver from 'semver';
import moment from 'moment';
import fetch from 'node-fetch';

const npmVersion = {
    latestVersion: null,
    checkedVersionAt: null
};

/**
 * @param request
 * @param response
 */
export function getVersionRoute(request, response) {
    var versionInfo = {
        version: pkg.version,
        isNewVersionAvailable: false
    };

    return getLastVersion()
        .then(versionResponse => {
            if (versionResponse) {
                versionInfo.lastReleasedVersion = versionResponse.version;
                versionInfo.isNewVersionAvailable = semver.gt(versionInfo.lastReleasedVersion, versionInfo.version);
            } else {
                versionInfo.lastReleasedVersion = null;
                versionInfo.isNewVersionAvailable = false;
            }
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
    if (npmVersion.checkedVersionAt > yesterday()) {
        promise = Promise.resolve(npmVersion.latestVersion);
    } else {
        npmVersion.checkedVersionAt = moment().valueOf();
        promise = fetch('http://www.yakjs.com/version.json')
            .then(response => response.json())
            .catch(() => null);
    }

    return promise;
}

/**
 * @returns {number}
 */
function yesterday() {
    return moment().add(-1, 'days').valueOf();
}
