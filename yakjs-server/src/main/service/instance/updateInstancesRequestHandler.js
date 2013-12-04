/**
 * UpdateInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} cloudServer
 * @implements {yakServiceMessageHandler}
 */
yak.UpdateInstanceRequestHandler = function UpdateInstanceRequestHandler(cloudServer) {

    'use strict';

    /** @type {yak.CreateInstanceRequestHandler} */
    var self = this;

    /** Constructor */
    function constructor() {
    }

    /**
    * @param {yak.api.UpdateInstanceRequest} message
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {

        try {

            var foundInstance = checkInstanceName(message.instanceName);

            if (foundInstance) {
                var instance = new yak.WebSocketInstance(cloudServer, message.name, message.port);
                instance.description = message.description;
                instance.plugins = message.plugins;

                console.log('updateInstance', instance);
                cloudServer.removeInstance(message.instanceName);
                cloudServer.addInstance(instance);

                connection.send(new yak.api.UpdateInstanceResponse());
            } else {
                var response = new yak.api.UpdateInstanceResponse();
                response.success = false;
                response.message = 'No instance with name ' + message.name + ' found';
                connection.send(response);
            }
        } catch (ex) {
            cloudServer.serviceInstance.log.error(ex.message);
        }
    };

    /**
    * Check if instance name is already in use.
    * @param {string} name
    */
    function checkInstanceName(name) {

        var isNameAlreadyUsed = false;
        var instances = cloudServer.getInstances();

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