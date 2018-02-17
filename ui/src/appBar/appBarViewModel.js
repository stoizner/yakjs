const serverStatusProvider = require('../core/serverStatusProvider');

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
     * @type {!Subject<Object>}
     */
    this.versionInfo = serverStatusProvider.versionInfo;

    function constructor() {
    }

    constructor();
}

module.exports = AppBarViewModel;
