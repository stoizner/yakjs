/**
 * InstanceManager
 * @constructor
 * @param {yak.PluginManager} pluginManager
 */
yak.InstanceManager = function InstanceManager(pluginManager) {
    /**
     * @type {yak.InstanceManager}
     */
    var self = this;

    /**
     * @type {string}
     */
    var INSTANCES_DIR = './instances/';

    /**
     * @type {string}
     */
    var PLUGIN_FILENAME_POSTFIX = '.instance.json';

    /**
     * Filesystem
     */
    var fs = require('fs');

    /**
     * @type {!Object<string, yak.Instance>}
     */
    var instances = {};

    /**
     * @type {Object<string, yak.ServerInstance>}
     */
    var instanceEntities = {};

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * Load instances from instances directory.
     */
    this.loadInstances = function loadInstances() {
        log.info('Loading instances from instance directory', {dir:INSTANCES_DIR});

        var filenames = getInstanceFilenames();
        log.info('Instance files found.', {filesFound: filenames.length, filenames: filenames});

        readAndParseInstanceFiles(filenames);
    };

    /**
     * Read file content and parse it.
     * @param {!Array<string>} filenames
     */
    function readAndParseInstanceFiles(filenames) {
        var fileContent = readInstanceFiles(filenames);

        _.each(fileContent, function parse(content, filename) {
            var instance = self.parseInstance(filename, content);
            if (instance) {
                self.addOrUpdateInstance(instance);
            } else {
                log.warn('Instance is not defined.', {filename: filename});
            }
        });
    }

    /**
     * @param {string} filename The instance id will be generated out of the filename.
     * @param {string} content The file json content.
     * @returns {yak.Instance} The parsed instance.
     */
    this.parseInstance = function parseInstance(filename, content) {
        /**
         * @type {yak.Instance}
         */
        var instance = null;

        try {
            instance = JSON.parse(content);
            instance.id = filename.replace(PLUGIN_FILENAME_POSTFIX, '');
        } catch(ex) {
            log.warn('Can not load instance. Maybe the instance file is not a valid json.', {filename: filename, error: ex.message});
        }

        return instance;
    };

    /**
     * @param {!Array<string>} filenames
     * @returns {!Object<string, string>} Map with all file content.
     */
    function readInstanceFiles(filenames) {
        var contentMap = {};

        _.each(filenames, function readFile(filename) {
            try {
                var fileContent = fs.readFileSync(INSTANCES_DIR + filename, {encoding: 'utf8'});

                // Clean up windows line endings.
                contentMap[filename] = fileContent.replace('\r\n', '\n');
            } catch(ex) {
                log.warn('Could not read instance file.', {filename: filename, error: ex.message});
            }
        });
        log.info('Instance files read.', {filesRead: _.toArray(contentMap).length});

        return contentMap;
    }

    /**
     * Search for instance files in instance directory.
     * @returns {!Array<string>} List of instance filenames found in the INSTANCES_DIR folder.
     */
    function getInstanceFilenames() {
        var files =  fs.readdirSync(INSTANCES_DIR);
        var filenames =  _.filter(files, function useFilesWithPluginPostfix(filename) {
            return filename.lastIndexOf(PLUGIN_FILENAME_POSTFIX) === (filename.length - PLUGIN_FILENAME_POSTFIX.length);
        });

        return filenames;
    }

    /**
     * @param {string} id
     * @returns {yak.Instance} The instance.
     */
    this.getInstance = function getInstance(id) {
        return instances[id];
    };

    /**
     * @param {string} id
     * @returns {yak.InstanceEntity} The instance.
     */
    this.getInstanceEntity = function getInstanceEntity(id) {
        return instanceEntities[id];
    };

    /**
     * Get list of instances.
     * @returns {Array<yak.Instance>} List of instances.
     */
    this.getInstances = function getInstances() {
        return _.values(instances);
    };

    /**
     * Get list of instance entities.
     * @returns {Array<yak.InstanceEntity>} List of instance entities.
     */
    this.getInstanceEntities = function getInstanceEntities() {
        return _.values(instanceEntities);
    };

    /**
     * @param {yak.Instance} instance
     */
    this.addOrUpdateInstance = function addOrUpdateInstance(instance) {
        if (instance.id && instances[instance.id]) {
            self.updateInstance(instance);
        } else {
            self.addInstance(instance);
        }
    };

    /**
     * @param {yak.Instance} instance
     */
    this.addInstance = function addInstance(instance) {
        instances[instance.id] = instance;

        self.saveInstance(instance);
        updateEntity(instance);
    };

    /**
     * @param {yak.Instance} instance
     */
    this.updateInstance = function updateInstance(instance) {
        var existingInstance = instances[instance.id];
         _.extend(existingInstance, instance);

        self.saveInstance(existingInstance);
        updateEntity(instance);
    };

    /**
     * Update instance entity.
     * @param {yak.Instance} instance
     */
    function updateEntity(instance) {
        if (instanceEntities[instance.id]) {
            instanceEntities[instance.id].stop();
        }

        instanceEntities[instance.id] = self.createInstanceEntity(instance);

        if (instance.autoStartEnabled) {
            instanceEntities[instance.id].start();
        }
    }

    /**
     * @param {string} id The ID of the instance.
     */
    this.removeInstance = function removeInstance(id) {
        if (instances.hasOwnProperty(id)) {
            delete instances[id];

            var filename = toFilename(id);
        }

        try {
            fs.unlinkSync(filename);
        } catch (ex) {
            log.warn('Could not remove file ' + filename, {error: ex.message});
        }

        if (instanceEntities[id]) {
            instanceEntities[id].stop();
            delete instanceEntities[id];
        }
    };

    /**
     * Create a instance entity.
     * @param {yak.Instance} instance
     * @returns {*} The instance entity.
     */
    this.createInstanceEntity = function createInstanceEntity(instance) {
        log.info('Create instance entity.', {id: instance.id});
        var entity = null;

        try {
            entity = new yak.WebSocketInstance(pluginManager, instance.id, instance.port);
            entity.name = instance.name;
            entity.description = instance.description;
            entity.plugins = instance.plugins;
            entity.autoStartEnabled = instance.autoStartEnabled;
        } catch(ex) {
            entity = null;
            log.error('Can not create instance entity', { id: instance.id, error: ex.message });
            log.debug('Error Stack', { stack: ex.stack });
        }

        return entity;
    };

    /**
     * Update config and save it.
     */
    this.saveInstances = function saveInstances() {
        log.info('Save instances');
        _.each(instances, function saveInstance(instance) {
            self.saveInstance(instance);
        });
    };

    /**
     * Save a instance to the file system.
     * @param {yak.Instance} instance
     */
    this.saveInstance = function saveInstance(instance) {
        var filename = toFilename(instance.id);

        try {
            fs.writeFileSync(filename, JSON.stringify(instance, null, 4), {encoding: 'utf8'});
        } catch(ex) {
            log.error('Could not save instance to file system.', {instance: instance.id, filename: filename, error: ex.message});
        }
    };

    /**
     * Start an instance entity.
     * @param {string} id The id of the instance.
     * @throws {Error} Instance entity not found.
     */
    this.start = function start(id) {
        log.info('Start instance', { instance: id });
        if (instanceEntities[id]) {
            instanceEntities[id].start();

            var instance = self.getInstance(id);
            instance.autoStartEnabled = true;
            self.saveInstance(instance);
        }  else {
            throw new Error('Instance entity not found.', { instance: id });
        }
    };

    /**
     * Stop an instance entity.
     * @param {string} id The ID of the instance.
     * @throws {Error} Instance entity not found.
     */
    this.stop = function stop(id) {
        log.info('Stop instance', { instance: id });
        if (instanceEntities[id]) {
            instanceEntities[id].stop();

            var instance = self.getInstance(id);
            instance.autoStartEnabled = false;
            self.saveInstance(instance);
        }  else {
            throw new Error('Instance entity not found.', { instance: id });
        }
    };

    /**
     * Create instance entities from instances (definitions).
     */
    function createEntities() {
        instanceEntities = {};
        _.each(instances,
            /**
             * @param {yak.Instance} instance
             */
            function createEntityFromInstance(instance) {
                var entity = self.createInstanceEntity(instance);
                if (entity) {
                    instanceEntities[instance.id] = entity;
                }
            }
        );
    }

    /**
     * Get the full filename + path out of the instance name.
     * @param {string} instanceId
     * @returns {string} The filename to the instance config file.
     */
    function toFilename(instanceId) {
        return INSTANCES_DIR + instanceId + PLUGIN_FILENAME_POSTFIX;
    }
};
