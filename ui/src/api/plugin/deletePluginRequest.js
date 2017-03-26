/**
 * @constructor
 * @implements {yak.api.Request}
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
    * ID of the plugin.
    * @type {string}
    */
    this.pluginId = null;
};
