/**
 * GetPluginsResponse
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
    * List of available cloud Plugins as InstanceInfo array.
    * @type {Array.<yak.api.PluginInfo>}
    */
    this.plugins = [];
};
