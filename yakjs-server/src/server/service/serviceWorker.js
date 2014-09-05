/**
 * ServiceWorker
 * @constructor
 * @implements {yak.PluginWorker}
 * @param {yak.YakServer} yakServer
 */
yak.ServiceWorker = function ServiceWorker(yakServer) {
    /**
     * @type {yak.ServiceWorker}
     */
    var self = this;

    /**
     * @type {string}
     */
    this.name = self.constructor.name;

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {Object.<string, Object>}
     */
    var apiMap = {};

    /**
     * Constructor
     */
    function constructor() {

        // Instance
        apiMap['request.startInstance'] = new yak.StartInstanceRequestHandler(yakServer);
        apiMap['request.stopInstance'] = new yak.StopInstanceRequestHandler(yakServer);
        apiMap['request.restartInstance'] = new yak.RestartInstanceRequestHandler(yakServer);
        apiMap['request.getInstances'] = new yak.GetInstancesRequestHandler(yakServer);
        apiMap['request.createInstance'] = new yak.CreateInstanceRequestHandler(yakServer);
        apiMap['request.updateInstance'] = new yak.UpdateInstanceRequestHandler(yakServer);
        apiMap['request.removeInstance'] = new yak.DeleteInstanceRequestHandler(yakServer);

        // Plugin
        apiMap['request.getPlugins'] = new yak.GetPluginsRequestHandler(yakServer);
        apiMap['request.createPlugin'] = new yak.CreatePluginRequestHandler(yakServer);
        apiMap['request.createOrUpdatePlugin'] = new yak.CreateOrUpdatePluginRequestHandler(yakServer);
        apiMap['request.deletePlugin'] = new yak.DeletePluginRequestHandler(yakServer);
        apiMap['request.updatePlugin'] = new yak.UpdatePluginRequestHandler(yakServer);

        // Log
        apiMap['request.getLogInfo'] = new yak.GetLogInfoRequestHandler(yakServer);

        // Store
        apiMap['request.getStoreKeyInfo'] = new yak.GetStoreKeyInfoRequestHandler(yakServer);
        apiMap['request.getStoreValue'] = new yak.GetStoreValueRequestHandler(yakServer);
        apiMap['request.setStoreValue'] = new yak.SetStoreValueRequestHandler(yakServer);
        apiMap['request.deleteStoreItem'] = new yak.DeleteStoreItemRequestHandler(yakServer);
    }

    /**
     * @param {yak.WebSocketConnection} [connection]
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {yak.WebSocketMessage} message
     * @param {yak.WebSocketConnection} connection
     * @param {yak.ServiceInstance} instance
     */
    this.onMessage = function onMessage(message, connection, instance) {
        try {
            log.info('onMessage', { data: message.data });
            var msg = JSON.parse(message.data);

            if (msg.type && apiMap.hasOwnProperty(msg.type)) {
                apiMap[msg.type].handle(msg, connection);
            } else {
                log.warn('No handler found for ', { type: msg.type });
            }
        } catch (ex) {
            log.error(ex.message);
            log.error(ex.stack);
        }
    };

    constructor();
};
