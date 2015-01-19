/**
 * GetPluginsRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.GetPluginsRequestHandler = function GetPluginsRequestHandler(yakServer) {
    /**
     * @type {yak.GetPluginsRequestHandler}
     */
    var self = this;

    /**
     * @param {yak.api.GetPluginsRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(request, connection) {
        try {
            var plugins = yakServer.pluginManager.getPlugins();

            var response = new yak.api.GetPluginsResponse(request.id);

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
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
