/**
 * UpdateInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.UpdateInstanceRequestHandler = function UpdateInstanceRequestHandler(yakServer) {
    /**
     * @type {yak.UpdateInstanceRequestHandler}
     */
    var self = this;

    /**
    * @param {yak.api.UpdateInstanceRequest} message
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {
        try {

            var foundInstance = checkInstanceName(message.instanceName);

            if (foundInstance) {
                var instance = new yak.WebSocketInstance(yakServer, message.name, message.port);
                instance.description = message.description;
                instance.plugins = message.plugins;

                yakServer.removeInstance(message.instanceName);
                yakServer.addInstance(instance);
                yakServer.updateAndSaveConfig();

                connection.send(new yak.api.UpdateInstanceResponse());
            } else {
                var response = new yak.api.UpdateInstanceResponse();
                response.success = false;
                response.message = 'No instance with name ' + message.name + ' found';
                connection.send(response);
            }
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };

    /**
     * Check if instance name is already in use.
     * @param {string} name
     * @returns {boolean} Whether instance name is already in user or not.
     */
    function checkInstanceName(name) {
        var isNameAlreadyUsed = false;
        var instances = yakServer.getInstances();

        for(var i = 0; i < instances.length; i++) {
            if (instances[i].name.trim() === name.trim()) {
                isNameAlreadyUsed = true;
                break;
            }
        }

        return isNameAlreadyUsed;
    }
};
