/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.ClearModuleCacheRequest = function ClearModuleCacheRequest() {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.clearModuleCacheRequest';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
};
