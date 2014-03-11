/**
 * DeleteInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.DeleteInstanceRequestHandler = function DeleteInstanceRequestHandler(yakServer) {

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
            yakServer.removeInstance(message.instanceName);
            yakServer.updateAndSaveConfig();
            connection.send(new yak.api.DeleteInstanceResponse());
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };

    constructor();
};