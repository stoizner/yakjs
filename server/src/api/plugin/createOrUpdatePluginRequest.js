/**
 * CreateOrUpdatePluginRequest
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.CreateOrUpdatePluginRequest = function CreateOrUpdatePluginRequest() {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.createOrUpdatePlugin';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
     * The plugin id. Set to null when creating a new plugin.
     * @type {?string}
     */
    this.pluginId = null;

    /**
     * The plugin configuration.
     * @type {!yak.api.PluginConfig}
     */
    this.plugin = null;
};
