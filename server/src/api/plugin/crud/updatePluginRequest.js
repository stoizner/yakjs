/**
 * UpdatePluginRequest
 * @constructor
 */
yak.api.UpdatePluginRequest = function UpdatePluginRequest() {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.updatePlugin';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
    * The original Plugin name.
    * @type {null}
    */
    this.pluginName = null;

    /**
    * Unique name of Plugin.
    * @type {string}
    */
    this.name = null;

    /**
    * Some description.
    * @type {string}
    */
    this.description = null;

    /**
     * The semantic version number of the plugin (optional)
     * @type {?string}
     */
    this.version = null;

    /**
    * The plugin code.
    * @type {string}
    */
    this.code = 0;
};
