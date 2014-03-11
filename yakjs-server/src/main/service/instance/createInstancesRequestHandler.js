/**
 * CreateInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.CreateInstanceRequestHandler = function CreateInstanceRequestHandler(yakServer) {

    'use strict';

    /** @type {yak.CreateInstanceRequestHandler} */
    var self = this;

    /** Constructor */
    function constructor() {
    }

    /**
    * @param {yak.api.CreateInstanceRequest} message
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {

        try {

            var isNameAlreadyUsed = checkInstanceName(message.name);

            if (isNameAlreadyUsed) {
                var response = new yak.api.CreateInstanceResponse();
                response.success = false;
                response.message = 'Cannot create instance: Name is already used.';
                connection.send(response);
            } else {
                var newInstance = new yak.WebSocketInstance(yakServer, message.name, message.port);
                newInstance.description = message.description;
                newInstance.plugins = message.plugins;

                yakServer.addInstance(newInstance);
                yakServer.updateAndSaveConfig();
                connection.send(new yak.api.CreateInstanceResponse());
            }
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };

    /**
    * Check if instance name is already in use.
    * @param {string} name
    */
    function checkInstanceName(name) {

        var isNameAlreadyUsed = false;
        var instances = yakServer.getInstances();

        for(var i=0; i<instances.length; i++) {
            if (instances[i].name.trim() === name.trim()) {
                isNameAlreadyUsed = true;
                break;
            }
        }

        return isNameAlreadyUsed;
    }

    constructor();
};