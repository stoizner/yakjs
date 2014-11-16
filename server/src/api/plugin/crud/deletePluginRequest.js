/**
 * RemovePluginRequest
 * @constructor
 */
yak.api.DeletePluginRequest = function DeletePluginRequest() {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.deletePlugin';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
    * Name of the Plugin.
    * @type {string}
    */
    this.pluginName = null;
};
