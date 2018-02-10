'use strict';

const configProvider = require('./config/configProvider');
const PluginManager = require('./plugin/pluginManager');
const storeProvider = require('./store/storeProvider');
const ModuleProvider = require('./modules/moduleProvider');
const CommandPresetProvider = require('./command/commandPresetProvider');
const InstanceConfigProvider = require('./instanceConfig/instanceConfigProvider');
const InstanceManager = require('./instance/instanceManager');

/**
 * @class
 */
class ServerState {
    /**
     * @constructor
     * @struct
     */
    constructor() {
        this.config = configProvider.config;

        this.pluginManager = new PluginManager();
        this.pluginManager.loadPlugins();

        storeProvider.load();

        this.moduleProvider = new ModuleProvider();
        this.commandPresetsProvider = new CommandPresetProvider();

        this.instanceConfigProvider = new InstanceConfigProvider();
        this.instanceManager = new InstanceManager(this.instanceConfigProvider, this.pluginManager);
    }
}

module.exports = new ServerState();
