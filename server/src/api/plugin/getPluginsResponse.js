/**
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.GetPluginsResponse = function GetPluginsResponse(requestId) {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.getPlugins';

    /**
     * The original request id.
     * @type {string}
     */
    this.requestId = requestId;

    /**
     * Whether the request was successfully or not.
     * @type {boolean}
     */
    this.success = true;

    /**
     * List of all plugin configurations.
     * @type {!Array<!yak.api.PluginConfig>}
     */
    this.plugins = [];
};
