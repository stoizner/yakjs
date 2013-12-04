/**
 * RemoveInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} cloudServer
 * @implements {yakServiceMessageHandler}
 */
yak.RemoveInstanceRequestHandler = function RemoveInstanceRequestHandler(cloudServer) {

    'use strict';

    /** @type {yak.RemoveInstanceRequestHandler} */
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
            connection.send(new yak.api.RemoveInstanceResponse());
        } catch (ex) {
            cloudServer.serviceInstance.log.error(ex.message);
        }
    };

    constructor();
};