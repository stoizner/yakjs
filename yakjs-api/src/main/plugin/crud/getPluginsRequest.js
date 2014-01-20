/**
 * GetPluginsRequest
 * @constructor
 */
yak.api.GetPluginsRequest = function GetPluginsRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.getPlugins';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
};