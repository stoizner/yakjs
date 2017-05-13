/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function AppBarViewModel(context) {
    'use strict';

    /**
     * @type {AppBarViewModel}
     */
    var self = this;

    /**
     * @type {{lastCheckedAt: string, latestReleaseVersion: string, currentReleaseVersion: string, isLatestReleaseInUse: boolean, latestRelease: *}}
     */
    this.versionCheckResult = null;

    /**
     * @type {Function}
     */
    this.onVersionCheckResultChanged = _.noop;

    /**
     * @type {string}
     */
    this.version = '';

    /**
     * @type {Function}
     */
    this.onVersionChanged = _.noop;

    function constructor() {
        context.versionChecker.checkLatestRelease().then(function(versionCheckResult) {
            self.versionCheckResult = versionCheckResult;
            self.onVersionCheckResultChanged(versionCheckResult);
        });

        context.adapter.get('/version').then(function(info) {
            self.version = info.version;
            self.onVersionChanged(info.version);
        });
    }

    constructor();
}

module.exports = AppBarViewModel;
