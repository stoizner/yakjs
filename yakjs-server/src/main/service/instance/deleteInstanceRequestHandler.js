/**
 * DeleteInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} cloudServer
 * @implements {yakServiceMessageHandler}
 */
yak.DeleteInstanceRequestHandler = function DeleteInstanceRequestHandler(cloudServer) {

    'use strict';

    /** @type {yak.DeleteInstanceRequestHandler} */
    var self = this;

    /** Constructor */
    function constructor() {
    }

    /**
    * @param {yak.WebSocketMessage} message
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {
        try {
            cloudServer.removeInstance(message.instanceName);
            connection.send(new yak.api.DeleteInstanceResponse());
        } catch (ex) {
            cloudServer.serviceInstance.log.error(ex.message);
        }
    };

    constructor();
};