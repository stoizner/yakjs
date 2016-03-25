/**
 * @constructor
 */
yak.ui.VersionChecker = function VersionChecker() {
    'use strict';

    var LOCALSTORE_KEY = 'versionCheckResult';

    /**
     * @returns {Promise}
     */
    this.checkLatestRelease = function checkLatestRelease() {
        return getLatestRelease();
    };

    /**
     * @returns {Promise}
     */
    function getLatestRelease() {
        var promise;
        var cachedVersionCheckResult = getCachedVersionCheckResult();

        if (cachedVersionCheckResult) {
            console.log('Using cachedVersionCheckResult');
            promise = Promise.resolve(cachedVersionCheckResult);
        } else {
            console.log('Request releases via github api');
            promise = sendGitHubApiRequest('/repos/cschuller/yakjs/releases')
                .then(findLatestRelease)
                .then(checkIfLatestReleaseIsUsed)
                .then(persistInLocalstorage);
        }

        return promise;
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
     * @returns {T?}
     */
    function findLatestRelease(httpResponse) {
        var releases = JSON.parse(httpResponse);

        var latestRelease = _.sortBy(releases, function(release) {
            return new Date(release['published_at']).getTime();
        }).reverse();

        return latestRelease[0];
    }

    /**
     * @param {?} latestRelease
     * @returns {{lastCheckedAt: string, latestReleaseVersion: (XML|string|void), currentReleaseVersion: *, isLatestReleaseInUse: boolean, latestRelease: *}}
     */
    function checkIfLatestReleaseIsUsed(latestRelease) {
        var latestReleaseVersion = latestRelease['tag_name'].replace('v', '');
        var currentReleaseVersion = yak.ui.appInfo.version;
        var isLatestReleaseInUse =  latestReleaseVersion === currentReleaseVersion;

        return {
            lastCheckedAt: (new Date()).toISOString(),
            latestReleaseVersion: latestReleaseVersion,
            currentReleaseVersion: currentReleaseVersion,
            isLatestReleaseInUse: isLatestReleaseInUse,
            latestRelease: latestRelease
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
};
