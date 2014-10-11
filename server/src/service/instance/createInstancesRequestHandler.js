/**
 * CreateInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.CreateInstanceRequestHandler = function CreateInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.CreateInstanceRequestHandler}
     */
    var self = this;

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
                var newInstance = _.clone(message.instance);

                yakServer.instanceManager.addOrUpdateInstance(newInstance);

                connection.send(new yak.api.CreateInstanceResponse());
            }
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };

    /**
     * Check if instance name is already in use.
     * @param {string} name
     * @returns {boolean} Whether the name is already in use or not.
     */
    function checkInstanceName(name) {

        var isNameAlreadyUsed = false;
        var instances = yakServer.instanceManager.getInstances();

        _.each(instances, function checkIfNameIsAlreadyInUse(instance) {
            if (instance.name.trim() === name.trim()) {
                isNameAlreadyUsed = true;
            }
        });

        return isNameAlreadyUsed;
    }
};
