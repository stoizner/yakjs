/**
 * Get server log information
 * @constructor
 */
yak.api.GetLogInfoRequest = function GetLogInfoRequest() {

    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.getLogInfo';

    /**
     * Filter for a specific instance.
     * @type {?string}
     */
    this.filterInstanceName = null;

    /**
     * Maximal count of log results
     * @type {number}
     */
    this.maxCount = 500;
};