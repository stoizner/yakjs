/**
 * CreateInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.CreateInstanceRequestHandler = function CreateInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.CreateInstanceRequest} request
     * @returns {yak.api.CreateInstanceResponse} response
     */
    this.handle = function handle(request) {
       var newInstance = _.clone(request.instance);

        yakServer.instanceManager.addInstance(newInstance);

       return new yak.api.CreateInstanceResponse(request.id);
    };
};
