/**
 * StopInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} cloudServer
 * @implements {yakServiceMessageHandler}
 */
yak.StopInstanceRequestHandler = function StopInstanceRequestHandler(cloudServer) {
    'use strict';

    /** @type {yak.StartInstanceRequestHandler} */
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
            cloudServer.stopInstance(message.instanceName);
            connection.send(new yak.api.StartInstanceResponse());
        } catch (ex) {
            cloudServer.serviceInstance.log.error(ex.message);
        }
    };

    constructor();
};