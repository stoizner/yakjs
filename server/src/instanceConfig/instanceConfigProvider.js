/**
 * Provides the instance configurations.
 * @constructor
 */
yak.InstanceConfigProvider = function InstanceConfigProvider() {
    /**
     * @type {!yak.InstanceConfigProvider}
     */
    var self = this;

    /**
     * @type {string}
     */
    var INSTANCES_DIR = './instances/';

    /**
     * A instance config is stored in the format id.instance.json
     * @type {string}
     */
    var INSTANCE_CONFIG_MARKER = '.instance';

    /**
     * Filesystem
     */
    var fs = require('fs');
    var path = require('path');

    /**
     * Configs indexed by instance id.
     * @type {!Object<string, !yak.InstanceConfig>}
     */
    var instanceConfigs = {};

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * Initializes the config provider.
     */
    function constructor() {
        loadConfigurations();
    }

    /**
     * @param {string} id
     * @returns {yak.InstanceConfig} The instance.
     */
    this.getConfig = function getConfig(id) {
        return instanceConfigs[id];
    };

    /**
     * Get list of instances.
     * @returns {Array<yak.InstanceConfig>} List of instance configurations.
     */
    this.getConfigs = function getConfigs() {
        return _.values(instanceConfigs);
    };

    /**
     * @param {string} pluginId
     * @returns {Array<yak.InstanceConfig>} List of instance configurations.
     */
    this.getInstanceConfigsByPlugin = function getInstanceByPlugin(pluginId) {
        return Object
            .keys(instanceConfigs)
            .filter(function isPluginUsedBy(instanceConfig) { return instanceConfig.plugins.indexOf(pluginId) >= 0; });
    };

    /**
     * @param {yak.InstanceConfig} config
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

            var filename = toFilename(id);

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
        log.info('Loading instance configurations from instance directory', {dir:INSTANCES_DIR});

        var filenames = getInstanceConfigs();

        log.info('Instance configuration files found.', {filesCount: filenames.length, filenames: filenames});

        readAndParseInstanceConfigFiles(filenames);
    }

    /**
     * Search for instance config files in instance directory.
     * @returns {!Array<string>} List of filenames to instance config files found in the INSTANCES_DIR folder.
     */
    function getInstanceConfigs() {
        var filenames = fs.readdirSync(INSTANCES_DIR);

        return _.filter(filenames, function usingInstanceExtension(filename) {
            return path.extname(path.basename(filename, '.json')) === INSTANCE_CONFIG_MARKER;
        });
    }

    /**
     * Read file content and parse it.
     * @param {!Array<string>} filenames
     */
    function readAndParseInstanceConfigFiles(filenames) {
        var configs = _.map(filenames, function readAndParseConfig(filename) {
            var content = readConfig(filename);
            return parseConfig(filename, content);
        });

        instanceConfigs = _.indexBy(configs, 'id');
    }

    /**
     * @param {string} filename
     * @returns {string} The file content
     */
    function readConfig(filename) {
        var fileContent = null;

        try {
            fileContent = fs.readFileSync(INSTANCES_DIR + filename, {encoding: 'utf8'});

            // Clean up windows line endings.
            fileContent = fileContent.replace('\r\n', '\n');
        } catch(ex) {
            log.warn('Could not read instance configuration file.', {basename: filename, error: ex.message});
        }

        return fileContent;
    }

    /**
     * @param {string} filename The instance id will be generated out of the filename.
     * @param {string} content The file json content.
     * @returns {yak.InstanceConfig} The parsed instance configuration.
     */
    function parseConfig(filename, content) {
        /**
         * @type {yak.InstanceConfig}
         */
        var instanceConfig = null;

        try {
            instanceConfig = JSON.parse(content);
            instanceConfig.id = path.basename( path.basename(filename, '.json'), INSTANCE_CONFIG_MARKER);
        } catch(ex) {
            log.warn('Can not load instance. Maybe the instance file is not a valid json.', {filename: filename, error: ex.message});
        }

        return /** @type {yak.InstanceConfig} */(Object.seal(instanceConfig));
    }

    /**
     * Save a instance config to the file system.
     * @param {yak.InstanceConfig} config
     */
    function save(config) {
        var filename = toFilename(config.id);

        try {
            fs.writeFileSync(filename, JSON.stringify(config, null, 4), {encoding: 'utf8'});
        } catch(ex) {
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
};
