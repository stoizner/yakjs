/**
 * AppBarViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.AppBarViewModel = function AppBarViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.AppBarViewModel}
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
     * Initializes the app view.
     */
    function constructor() {
        context.versionChecker.checkLatestRelease().then(function(versionCheckResult) {
            self.versionCheckResult = versionCheckResult;
            self.onVersionCheckResultChanged(versionCheckResult);
        });
    }

    constructor();
};
