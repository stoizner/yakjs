/**
 * UpdateInstanceRequest
 * @constructor
 */
yak.api.UpdateInstanceRequest = function UpdateInstanceRequest() {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.updateInstance';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
    * The original instance name.
    * @type {null}
    */
    this.instanceName = null;

    /**
    * Unique name of instance.
    * @type {string}
    */
    this.name = null;

    /**
    * Some description.
    * @type {string}
    */
    this.description = null;

    /**
    *
    * @type {number}
    */
    this.port = 0;

    /**
    * Name of plugins that shall be used by this instance.
    * @type {Array.<string>}
    */
    this.plugins = [];
};
