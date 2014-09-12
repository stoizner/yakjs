/**
 * Get server log information
 * @constructor
 */
yak.api.GetLogInfoRequest = function GetLogInfoRequest() {
    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.getLogInfo';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

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
