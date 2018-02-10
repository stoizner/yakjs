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
     * See VersionInfo documentation at http://www.yakjs.com/api/package.html
     * @type {Object}
     */
    this.versionInfo = null;

    /**
     * @type {Function}
     */
    this.onVersionInfoChanged = _.noop;

    function constructor() {
        context.adapter.get('/version').then(versionInfo => {
            self.versionInfo = versionInfo;
            self.onVersionInfoChanged(versionInfo);
        });
    }

    constructor();
}

module.exports = AppBarViewModel;
