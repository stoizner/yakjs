/**
 * StopInstanceRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.StopInstanceRequestHandler = function StopInstanceRequestHandler(cloudServer) {
    'use strict';

    /** @type {cobu.wsc.StartInstanceRequestHandler} */
    var self = this;

    /** Constructor */
    function constructor() {
    }

    /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {
        try {
            cloudServer.stopInstance(message.instanceName);
            connection.send(new cobu.wsc.service.StartInstanceResponse());
        } catch (ex) {
            cloudServer.serviceInstance.log.error(ex.message);
        }
    };

    constructor();
};