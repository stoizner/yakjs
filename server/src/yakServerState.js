'use strict';

const ConfigProvider = require('./config/configProvider');
const PluginManager = require('./plugin/pluginManager');
const storeProvider = require('./store/storeProvider');
const ModuleProvider = require('./modules/moduleProvider');
const CommandPresetProvider = require('./command/commandPresetProvider');
const InstanceConfigProvider = require('./instanceConfig/instanceConfigProvider');
const InstanceManager = require('./instance/instanceManager');

let serverState = {};

serverState.configManager = new ConfigProvider();
serverState.configManager.load();

serverState.pluginManager = new PluginManager();
serverState.pluginManager.loadPlugins();

storeProvider.load();

serverState.moduleProvider = new ModuleProvider();
serverState.commandPresetsProvider = new CommandPresetProvider();

serverState.instanceConfigProvider = new InstanceConfigProvider();
serverState.instanceManager = new InstanceManager(serverState.instanceConfigProvider, serverState.pluginManager);

module.exports = serverState;
