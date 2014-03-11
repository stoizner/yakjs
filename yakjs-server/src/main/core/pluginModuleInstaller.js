/**
 * PluginModuleInstaller
 * @constructor
 * @param {yak.PluginManager} pluginManager
 */
yak.PluginModuleInstaller = function PluginModuleInstaller(pluginManager) {

    'use strict';

    var npm = require('npm');

    /**
     * @type {yak.PluginModuleInstaller}
     */
    var self = this;

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    var finishedCallback = function() {};

    var installedModules = [];

    /**
     * Constructor
     */
    function constructor() {
        log.info('PluginModuleInstaller');
    }

    /**
     * Install required modules.
     */
    this.installRequiredModules = function installRequiredModules(callback) {
        log.info('Install required modules');

        finishedCallback = callback;

        npm.load(npmLoaded);
    };

    /**
     * NPM Loaded
     * @param error
     * @param data
     */
    function npmLoaded(error, data) {
        log.info('npmLoaded', { error: error });

        npm.commands.list(listInstalledModulesAndPlugins);
    }

    /**
     * @param error
     * @param data
     */
    function listInstalledModulesAndPlugins(error, data) {
        log.info('Installed modules:', { error: error });

        _.each(data.dependencies, function(dependency) {
            var moduleInfo = {
                homepage: dependency.homepage,
                description: dependency.description,
                name: dependency.name,
                realName: dependency.realName,
                version: dependency.version
            };
            log.info(moduleInfo.name, moduleInfo);
            installedModules.push(moduleInfo.name);
        });

        /**
         * @type {Array.<yak.Plugin>}
         */
        var plugins = pluginManager.getPlugins();

        _.each(plugins, function(plugin) {
            log.info(plugin.name);
        });

        getRequiredModules();
    }

    /**
     *
     */
    function getRequiredModules() {
        var requiredModules = [];

        var require = function(module, installModule) {
            log.info({ module: module, installModule: installModule});

            if (installModule) {
                requiredModules.push(installModule);
            }
        };

        /**
         * @type {Array.<yak.Plugin>}
         */
        var plugins = pluginManager.getPlugins();

        _.each(plugins, function(plugin) {
            var instance = pluginManager.createPluginInstance(plugin.name, require);
        });

        installRequiredModules(requiredModules);
    }

    /**
     * @param requiredModules
     */
    function installRequiredModules(requiredModules) {
        var modulesToInstall = _.without(requiredModules, installedModules);
        log.info('Start installing modules.', { modulesToInstall: modulesToInstall });

        npm.commands.install(modulesToInstall, function(error, data) {
            log.info('Required modules installed', { error: error });

            updateModules(requiredModules);
        });
    }

    /**
     * @param requiredModules
     */
    function updateModules(requiredModules) {
        log.info('Start update modules.', { requiredModules: requiredModules });
        npm.commands.update(requiredModules, function(error, data) {
            log.info('Required modules updated', { error: error });
            finishedCallback();
        });
    }

    constructor();
};
