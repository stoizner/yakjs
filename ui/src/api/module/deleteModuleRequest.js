/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.DeleteModuleRequest = function DeleteModuleRequest() {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.deleteModule';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
    * Name of the module.
    * @type {string}
    */
    this.moduleName = null;
};
