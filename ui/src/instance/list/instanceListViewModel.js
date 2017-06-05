var InstanceInfoItem = require('./instanceInfoItem');
var InstanceView = require('../edit/instanceView');
var nameCompare = require('../../core/nameComparer');
var ShowViewCommand = require('../../workspace/showViewCommand');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function InstanceListViewModel(context) {
    'use strict';

    /**
     * @type {!InstanceListViewModel}
     */
    var self = this;

    /**
     * @type {!Array<!InstanceInfoItem>}
     */
    this.items = [];

    /**
     * @type {Function}
     */
    this.onItemsChanged = _.noop;

    function constructor() {
        console.log('InstanceListViewModel.constructor');
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('InstanceListViewModel.active');
        context.adapter.get('/instances').then(handleGetInstancesResponse);
    };

    /**
     * Start instance.
     * @param {string} id
     */
    this.startInstance = function startInstance(id) {
        context.adapter.post('/instances/' + id + '/start').then(self.reload);
    };

    /**
     * Send request to restart all running instances.
     */
    this.restartAllInstances = function restartAllInstances() {
        context.adapter.post('/instances/running/restart').then(self.reload);
    };

    /**
     * Stop instance.
     * @param {string} id
     */
    this.stopInstance = function stopInstance(id) {
        context.adapter.post('/instances/' + id + '/stop').then(self.reload);
    };

    /**
     * Show and activate the instance edit panel.
     * @param {InstanceInfo} [item]
     */
    this.activateInstanceEditPanel = function activateInstanceEditPanel(item) {
        context.eventBus.post(new ShowViewCommand(InstanceView, item));
    };

    this.reload = function reload() {
        context.adapter.get('/instances').then(handleGetInstancesResponse);
    };

    /**
     * @param {GetInstancesResponse} response
     */
    function handleGetInstancesResponse(response) {
        console.log('handleGetInstancesResponse', {response: response});

        self.items = response.instances.map(toInstanceItem);
        self.items = self.items.sort(nameCompare);

        self.onItemsChanged();
    }

    /**
     * @param {!InstanceInfo} instanceInfo
     * @returns {!InstanceInfoItem}
     */
    function toInstanceItem(instanceInfo) {
        var instanceItem = new InstanceInfoItem(instanceInfo.id);
        instanceItem.name = instanceInfo.name;
        instanceItem.port = instanceInfo.port;
        instanceItem.state = instanceInfo.state;
        instanceItem.description = instanceInfo.description;
        instanceItem.plugins = instanceInfo.plugins;

        if (instanceInfo.state === 'running' && instanceInfo.pluginActiveCount !== instanceInfo.pluginTotalCount) {
            instanceItem.state = 'warning';
            instanceItem.stateTooltipText = 'Running, but some plugins could not be started. Please take a look into your log files to find the error.';
            instanceItem.hasPluginsNotStarted = ((instanceInfo.pluginTotalCount - instanceInfo.pluginActiveCount) > 0);
            instanceItem.inactivePluginsList = (instanceInfo.inactivePlugins || []).join(', ');
        }

        instanceItem.pluginTotalCount = instanceInfo.pluginTotalCount;
        instanceItem.pluginActiveCount = instanceInfo.pluginActiveCount;
        instanceItem.connectionCount = instanceInfo.connectionCount;

        return instanceItem;
    }

    constructor();
}

module.exports = InstanceListViewModel;
