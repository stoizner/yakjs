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
    * Plugin Code.
    * @type {string}
    */
    this.code = null;
};
