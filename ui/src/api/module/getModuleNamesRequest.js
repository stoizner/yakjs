/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.GetModuleNamesRequest = function GetModuleNamesRequest() {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.getModuleNames';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
};
