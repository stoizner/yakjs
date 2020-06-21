'use strict';

const {WebSocketInstance} = require('./webSocketInstance');

/**
 * @constructor
 * @struct
 * @param {Service} service
 */
function InstanceManager(service) {
    /**
     * @type {!InstanceManager}
     */
    const self = this;

    /**
     * @type {Map<string, WorkerInstance>}
     */
    const workerInstances = new Map();

    const {log, pluginManager} = service;

    /**
     * @param {string} instanceId
     * @returns {WorkerInstance} The instance.
     */
    this.getInstance = function getInstance(instanceId) {
        return workerInstances.get(instanceId)
    };

    /**
     * @param {YakInstance} yakInstance
     */
    this.addInstance = async function addInstances(yakInstance) {
        await createWorkerInstance(yakInstance);
    };

    /**
     * @returns {Array<WorkerInstance>} The instance.
     */
    this.getInstances = function getInstances() {
        return Array.from(workerInstances.values());
    };

    /**
     * @param {string} instanceId
     */
    this.stopAndRemoveInstance = async function stopAndRemoveInstance(instanceId) {
        if (workerInstances[instanceId]) {
            await self.stop(instanceId);
            workerInstances.delete(instanceId);
        }
    };

    /**
     * Create a instance.
     * @param {YakInstance} yakInstance
     * @returns {*} The instance entity.
     */
    async function createWorkerInstance(yakInstance) {
        const instanceId = yakInstance.id;
        log.debug('Create worker instance.', {instanceId});

        /**
         * @type {WebSocketInstance}
         */
        let instance = null;

        try {
            if (workerInstances.has(instanceId)) {
                await workerInstances.get(instanceId).stop();
                workerInstances.delete(instanceId);
            }

            instance = new WebSocketInstance(service, yakInstance);
            instance.name = yakInstance.name;
            instance.description = yakInstance.description;
            instance.plugins = yakInstance.plugins;

            workerInstances.set(instanceId, instance);
        } catch (ex) {
            instance = null;
            throw new Error(`YAKjs: Could not create new WebSocketInstance for "${yakInstance.id}".`);
        }

        return instance;
    }

    /**
     * Start an instance entity.
     * @param {string} instanceId The id of the instance.
     */
    this.start = async function start(instanceId) {
        log.info('Start instance', {instanceId});

        if (workerInstances.has(instanceId)) {
            const workerInstance = workerInstances.get(instanceId);

            await stopAllInstancesByPort(workerInstance.port, workerInstance);
            await workerInstance.start();
        } else {
            throw new Error('No worker instance found. Please use addInstance() before starting.');
        }
    };

    /**
     * Stop an instance entity.
     * @param {string} instanceId The ID of the instance.
     * @returns {!Promise}
     */
    this.stop = function stop(instanceId) {
        let promise;
        log.info('Stop instance', {instanceId});

        let instance = workerInstances.get(instanceId);

        if (instance) {
            promise = instance.stop();
        } else {
            promise = Promise.reject(`Could not find instance "${instanceId}"`);
        }

        return promise;
    };

    /**
     * @param {string} pluginId
     */
    this.removePlugin = function removePlugin(pluginId) {
        var instanceConfigs = configProvider.getInstanceConfigsByPlugin(pluginId);

        instanceConfigs.forEach(instanceConfig => {
            instanceConfig.plugins = instanceConfig.plugins.filter(id => id !== pluginId);
            configProvider.addOrUpdate(instanceConfig);
            self.createInstance(instanceConfig.id);
        });
    };

    /**
     * @param {number} port
     * @param {WorkerInstance} ownInstance
     */
    async function stopAllInstancesByPort(port, ownInstance) {
        for(const workerInstance of workerInstances.values()) {
            if (workerInstance !== ownInstance && workerInstance.port === port) {
                log.info('Stopping instance by port', {port});

                await workerInstance.stop();
            }
        }
    }
}

module.exports = {InstanceManager};
