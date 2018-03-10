const serverStatusProvider = require('../core/serverStatusProvider');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function AppBarViewModel(context) {
    'use strict';

    /**
     * @type {!Subject<Object>}
     */
    this.versionInfo = serverStatusProvider.versionInfo;
}

module.exports = AppBarViewModel;
