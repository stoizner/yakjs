/**
 * GetPluginsRequestHandler
 * @constructor
 * @param {yak.YakServer} cloudServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.GetPluginsRequestHandler = function GetPluginsRequestHandler(cloudServer) {
    /**
     * @type {yak.GetPluginsRequestHandler}
     */
    var self = this;

    /**
     * @param {yak.WebSocketMessage} message
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(message, connection) {
        try {
            var plugins = cloudServer.pluginManager.getPlugins();

            var response = new yak.api.GetPluginsResponse();

            for(var i = 0; i < plugins.length; i++) {
                var plugin = plugins[i];

                var pluginInfo = new yak.api.PluginInfo();

                pluginInfo.id = plugin.id;
                pluginInfo.name = plugin.id;

                pluginInfo.description = plugin.description;
                pluginInfo.code = plugin.code;
                pluginInfo.version = plugin.version;

                response.plugins.push(pluginInfo);
            }
            connection.send(response);
        } catch (ex) {
            cloudServer.serviceInstance.log.error(ex.message);
        }
    };
};
