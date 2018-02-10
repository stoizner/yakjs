const ServerConfigItem = require('./serverConfigItem');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function ServerConfigViewModel(context) {
    'use strict';

    /**
     * @type {ServerConfigViewModel}
     */
    var self = this;

    /**
     * @type {!ServerConfigItem}
     */
    this.serverConfig = {};

    /**
     * @type {function(!ServerConfigItem)}
     */
    this.onServerConfigChanged = _.noop;

    this.activate = function activate() {
        console.log('ModuleListViewModel.active');
        context.adapter.get('/config').then(handleGetServerConfigResponse);
    };

    /**
     * @param {ServerConfigItem} serverConfigItem
     * @returns {!Promise}
     */
    this.update = function update(serverConfigItem) {
        var serverConfig = {
            httpPort: serverConfigItem.httpPort,
            staticRoutes: parse(serverConfigItem.staticRoutesText)
        };

        return context
            .adapter
            .put('/config', {
                serverConfig: serverConfig
            })
    };

    /**
     * @param {?string} staticRoutesText
     * @returns {!Array<{name: string, path: string}>}
     */
    function parse(staticRoutesText) {
        var staticRoutes = [];

        if (staticRoutesText) {
            var lines = staticRoutesText.split('\n');
            lines = lines.filter(line => Boolean(line));

            staticRoutes = lines.map(line => {
                var parts = line.split('=');
                return {
                    name: parts[0].trim(),
                    path: parts[1].trim()
                };
            });
        }

        return staticRoutes;
    }

    /**
     * @param {{serverConfig: !Object}} response
     */
    function handleGetServerConfigResponse(response) {
        self.serverConfig = new ServerConfigItem(
            response.serverConfig.httpPort,
            response.serverConfig.staticRoutes.map(route => route.name + '=' + route.path).join('\n')
        );
        self.onServerConfigChanged(self.serverConfig);
    }
}

module.exports = ServerConfigViewModel;
