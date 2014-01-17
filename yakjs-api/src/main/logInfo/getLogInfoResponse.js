/**
 * GetLogInfoResponse
 * @constructor
 */
yak.api.GetLogInfoResponse = function GetLogInfoResponse() {

    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getLogInfo';

    /**
     * List of log information.
     * @type {Array.<yak.api.LogInfo>}
     */
    this.logs = [];
};