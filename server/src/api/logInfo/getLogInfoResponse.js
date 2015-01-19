/**
 * GetLogInfoResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.GetLogInfoResponse = function GetLogInfoResponse(requestId) {
    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getLogInfo';

    /**
     * The original request id.
     * @type {string}
     */
    this.requestId = requestId;

    /**
     * List of log information.
     * @type {Array.<yak.api.LogInfo>}
     */
    this.logs = [];
};
