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

    function constructor() {
        context.versionChecker.checkLatestRelease().then(function(versionCheckResult) {
            self.versionCheckResult = versionCheckResult;
            self.onVersionCheckResultChanged(versionCheckResult);
        });
    }

    constructor();
}

module.exports = AppBarViewModel;
