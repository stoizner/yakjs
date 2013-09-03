/**
 * UpdateInstanceRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.UpdateInstanceRequestHandler = function UpdateInstanceRequestHandler(cloudServer) {

    'use strict';

    /** @type {cobu.wsc.CreateInstanceRequestHandler} */
    var self = this;

    /** Constructor */
    function constructor() {
    }

    /**
    * @param {cobu.wsc.service.UpdateInstanceRequest} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {

        try {

            var foundInstance = checkInstanceName(message.instanceName);

            if (foundInstance) {
                var instance = new cobu.wsc.WebSocketInstance(cloudServer, message.name, message.port);
                instance.description = message.description;
                instance.plugins = message.plugins;

                console.log('updateInstance', instance);
                cloudServer.removeInstance(message.instanceName);
                cloudServer.addInstance(instance);

                connection.send(new cobu.wsc.service.UpdateInstanceResponse());
            } else {
                var response = new cobu.wsc.service.UpdateInstanceResponse();
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