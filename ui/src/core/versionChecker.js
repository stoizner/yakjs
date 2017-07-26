var httpAdapter = require('./httpAdapter/httpAdapter');

/**
 * @constructor
 * @struct
 */
function VersionChecker() {
    'use strict';

    var LOCALSTORE_KEY = 'versionCheckResult';

    /**
     * @returns {!Promise}
     */
    this.checkLatestRelease = function checkLatestRelease() {
        return getLatestRelease();
    };

    /**
     * @returns {!Promise}
     */
    function getLatestRelease() {
        var promise;
        var cachedVersionCheckResult = getCachedVersionCheckResult();

        if (cachedVersionCheckResult) {
            console.log('Using cachedVersionCheckResult');
            promise = Promise.resolve(cachedVersionCheckResult);
        } else {
            console.log('Request releases via github api');
            promise = Promise.all([
                    sendGitHubApiRequest('/repos/cschuller/yakjs/releases').then(findLatestRelease).then(extractLatestVersion),
                    getCurrentVersion()
                ])
                .then(checkIfLatestReleaseIsUsed)
                .then(persistInLocalstorage);
        }

        return promise;
    }

    function extractLatestVersion(latestRelease) {
        return latestRelease['tag_name'].replace('v', '');
    }

    function getCurrentVersion() {
        return httpAdapter.get('/version').then(response => response.version);
    }

    function getCachedVersionCheckResult() {
        console.log('getCachedVersionCheckResult');
        var cachedVersionCheckResult = null;

        if (localStorage) {
            var item = localStorage.getItem(LOCALSTORE_KEY);

            if (item) {
                cachedVersionCheckResult = JSON.parse(item);

                // Only use a cachedVersionCheck result when it is no older than 24h
                var expireTime = 60 * 1000; //24 * 60 * 60 * 1000;

                var lastCheckedAt = new Date(cachedVersionCheckResult.lastCheckedAt).getTime();

                if ((new Date() - lastCheckedAt) > expireTime) {
                    cachedVersionCheckResult = null;
                }

            }
        }

        return cachedVersionCheckResult;
    }

    /**
     * @param {string} httpResponse
     * @returns {?T}
     */
    function findLatestRelease(httpResponse) {
        var releases = JSON.parse(httpResponse);

        var latestRelease = _.sortBy(releases, function(release) {
            return new Date(release['published_at']).getTime();
        }).reverse();

        return latestRelease[0];
    }

    /**
     * @param {!Array} values With latest and current Version.
     * @returns{{lastCheckedAt: string, latestVersion: *, currentVersion: *, isLatestVersionInUse: boolean}}
     */
    function checkIfLatestReleaseIsUsed(values) {
        var latestVersion = values.shift();
        var currentVersion = values.shift();
        var isLatestVersionInUse =  latestVersion === currentVersion;

        return {
            lastCheckedAt: (new Date()).toISOString(),
            latestVersion: latestVersion,
            currentVersion: currentVersion,
            isLatestVersionInUse: isLatestVersionInUse
        }
    }

    function persistInLocalstorage(checkResult) {
        if (localStorage) {
            localStorage.setItem(LOCALSTORE_KEY, JSON.stringify(checkResult));
        }

        return checkResult;
    }

    /**
     * @param {string} api
     * @return {Promise}
     */
    function sendGitHubApiRequest(api) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://api.github.com' + api,
                type: 'GET',
                contentType: 'application/json',
                dataType: 'text',
                success: resolve,
                error: reject
            });
        });
    }
}

module.exports = VersionChecker;
