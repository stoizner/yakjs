/**
 * GetPluginsResponse
 * @constructor
 * @implements {yak.api.Response}
 */
yak.api.GetPluginsResponse = function GetPluginsResponse() {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.getPlugins';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
    * List of available cloud Plugins as InstanceInfo array.
    * @type {Array.<yak.api.PluginInfo>}
    */
    this.plugins = [];
};
