'use strict';

const log = require('../infrastructure/logger').defaultLogger;
const fs = require('fs');
const path = require('path');
const magic = require('../util/magicNumbers');

/**
 * Provides the instance configurations.
 * @constructor
 * @struct
 */
function InstanceConfigProvider() {
    /**
     * @type {string}
     */
    const INSTANCES_DIR = path.join(__dirname, '../../instances/');

    /**
     * A instance config is stored in the format id.instance.json
     * @type {string}
     */
    const INSTANCE_CONFIG_MARKER = '.instance';

    /**
     * Configs indexed by instance id.
     * @type {!Object<string, !yak.InstanceConfig>}
     */
    let instanceConfigs = {};

    /**
     * Initializes the config provider.
     */
    function constructor() {
        loadConfigurations();
    }

    /**
     * @param {string} id
     * @returns {InstanceConfig} The instance configuration.
     */
    this.getConfig = function getConfig(id) {
        return instanceConfigs[id];
    };

    /**
     * Get list of instances.
     * @returns {Array<InstanceConfig>} List of instance configurations.
     */
    this.getConfigs = function getConfigs() {
        return Object.values(instanceConfigs);
    };

    /**
     * @param {string} pluginId
     * @returns {!Array<!InstanceConfig>} List of instance configurations.
     */
    this.getInstanceConfigsByPlugin = function getInstanceByPlugin(pluginId) {
        return Object
            .keys(instanceConfigs)
            .map(key => instanceConfigs[key])
            .filter(instanceConfig => instanceConfig.plugins && instanceConfig.plugins.indexOf(pluginId) >= 0);
    };

    /**
     * @param {!InstanceConfig} config
     */
    this.addOrUpdate = function addOrUpdate(config) {
        log.debug('Add or update instance configuration.', {instanceId: config.id});

        instanceConfigs[config.id] = config;

        save(config);
    };

    /**
     * @param {string} id The ID of the instance config.
     */
    this.remove = function remove(id) {
        if (instanceConfigs[id]) {
            delete instanceConfigs[id];

            let filename = toFilename(id);

            try {
                fs.unlinkSync(filename);
            } catch (ex) {
                log.warn('Could not remove file ' + filename, {error: ex.message});
            }
        }
    };

    /**
     * Load instance configs from instances directory.
     */
    function loadConfigurations() {
        log.debug('Loading instance configurations from instance directory', {dir: INSTANCES_DIR});

        let filenames = getInstanceConfigs();

        log.info('Instance configuration files found.', {instances: filenames});

        readAndParseInstanceConfigFiles(filenames);
    }

    /**
     * Search for instance config files in instance directory.
     * @returns {!Array<string>} List of filenames to instance config files found in the INSTANCES_DIR folder.
     */
    function getInstanceConfigs() {
        const filenames = fs.readdirSync(INSTANCES_DIR);

        return filenames.filter(filename => path.extname(path.basename(filename, '.json')) === INSTANCE_CONFIG_MARKER);
    }

    /**
     * Read file content and parse it.
     * @param {!Array<string>} filenames
     */
    function readAndParseInstanceConfigFiles(filenames) {
        const configs = filenames.map(filename => {
            let content = readConfig(filename);
            return parseConfig(filename, content);
        });

        instanceConfigs = configs.filter(x => x).reduce((map, config) => {
            map[config.id] = config;
            return map;
        }, {});
    }

    /**
     * @param {string} filename
     * @returns {string} The file content
     */
    function readConfig(filename) {
        let fileContent = null;

        try {
            fileContent = fs.readFileSync(INSTANCES_DIR + filename, {encoding: 'utf8'});

            // Clean up windows line endings.
            fileContent = fileContent.replace('\r\n', '\n');
        } catch (ex) {
            log.warn('Could not read instance configuration file.', {basename: filename, error: ex.message});
        }

        return fileContent;
    }

    /**
     * @param {string} filename The instance id will be generated out of the filename.
     * @param {string} content The file json content.
     * @returns {InstanceConfig} The parsed instance configuration.
     */
    function parseConfig(filename, content) {
        let instanceConfig = null;

        try {
            instanceConfig = JSON.parse(content);
            instanceConfig.id = path.basename(path.basename(filename, '.json'), INSTANCE_CONFIG_MARKER);
        } catch (ex) {
            log.warn('Can not load instance. Maybe the instance file is not a valid json.', {filename: filename, error: ex.message});
        }

        return /** @type {!InstanceConfig} */(Object.seal(instanceConfig));
    }

    /**
     * Save a instance config to the file system.
     * @param {!InstanceConfig} config
     */
    function save(config) {
        let filename = toFilename(config.id);

        try {
            fs.writeFileSync(filename, JSON.stringify(config, null, magic.JSON_SPACE), {encoding: 'utf8'});
        } catch (ex) {
            log.error('Could not save instance to file system.', {instance: config.id, filename: filename, error: ex.message});
        }
    }

    /**
     * Get the full filename + path out of the instance name.
     * @param {string} instanceId
     * @returns {string} The filename to the instance config file.
     */
    function toFilename(instanceId) {
        return INSTANCES_DIR + instanceId + INSTANCE_CONFIG_MARKER + '.json';
    }

    constructor();
}

module.exports = InstanceConfigProvider;
