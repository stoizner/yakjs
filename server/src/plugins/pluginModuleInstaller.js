/**
 * PluginModuleInstaller
 * @constructor
 * @param {yak.PluginManager} pluginManager
 */
yak.PluginModuleInstaller = function PluginModuleInstaller(pluginManager) {
    var npm = require('npm');

    /**
     * @type {yak.PluginModuleInstaller}
     */
    var self = this;

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {Function}
     */
    var finishedCallback = function noop() {};

    /**
     * @type {Array}
     */
    var installedModules = [];

    /**
     * Install required modules.
     * @param {Function} callback when install is finished.
     */
    this.installRequiredModules = function installRequiredModules(callback) {
        log.info('Install required modules');

        finishedCallback = callback;

        npm.load(npmLoaded);
    };

    /**
     * NPM Loaded
     * @param {?} error
     * @param {?} data
     */
    function npmLoaded(error, data) {
        log.info('npmLoaded', { error: error });

        npm.commands.list(listInstalledModulesAndPlugins);
    }

    /**
     * @param {?} error
     * @param {?} data
     */
    function listInstalledModulesAndPlugins(error, data) {
        log.debug('Installed modules:', {error: error});

        _.each(data.dependencies, function extractInstalledModules(dependency) {
            var moduleInfo = {
                homepage: dependency.homepage,
                description: dependency.description,
                name: dependency.name,
                realName: dependency.realName,
                version: dependency.version
            };
            log.debug('Module', {name:moduleInfo.name, info:moduleInfo});
            installedModules.push(moduleInfo.name);
        });

        getRequiredModules();
    }

    /**
     * Get a list of required modules.
     */
    function getRequiredModules() {
        var requiredModules = [];

        var require = function requireModule(module, installModule) {
            log.info({ module: module, installModule: installModule});

            if (installModule) {
                requiredModules.push(installModule);
            }
        };

        /**
         * @type {Array.<yak.Plugin>}
         */
        var plugins = pluginManager.getPlugins();

        _.each(plugins, function createPluginInstance(plugin) {
            var instance = pluginManager.createPluginInstance(plugin.name, require);
        });

        installRequiredModules(requiredModules);
    }

    /**
     * @param {Array.<string>} requiredModules
     */
    function installRequiredModules(requiredModules) {
        var modulesToInstall = _.difference(requiredModules, installedModules);

        log.debug('Installed modules.', { installedModules: installedModules });
        log.debug('Required modules.', { requiredModules: requiredModules });
        log.debug('Modules to install', { modulesToInstall: modulesToInstall });

        if (modulesToInstall.length > 0) {
            log.info('Installing required NPM modules');

            npm.commands.install(modulesToInstall, function install(error, data) {
                log.info('Required modules installed', { error: error });

                // Only install required modules. Do not update it at startup
                // updateModules(requiredModules);

                finishedCallback();
            });
        } else {
            finishedCallback();
        }
    }

    /**
     * @param {Array.<string>} requiredModules
     */
    function updateModules(requiredModules) {
        log.info('Start update modules.', { requiredModules: requiredModules });
        npm.commands.update(requiredModules, function update(error, data) {
            log.info('Required modules updated', { error: error });
            finishedCallback();
        });
    }
};
