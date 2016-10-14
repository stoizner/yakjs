/**
 * InstanceListView
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.InstanceListViewModel = function InstanceListViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.InstanceListViewModel}
     */
    var self = this;

    /**
     * @type {!Array<yak.ui.InstanceInfoItem>}
     */
    this.items = [];

    /**
     * @type {Function}
     */
    this.onItemsChanged = _.noop;

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.InstanceListViewModel.constructor');
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('yak.ui.InstanceListViewModel.active');
        context.adapter.sendRequest(new yak.api.GetInstancesRequest(), handleGetInstancesResponse);
    };

    /**
     * Start instance.
     * @param {string} id
     */
    this.startInstance = function startInstance(id) {
        var request = new yak.api.StartInstanceRequest();
        request.instanceId = id;
        context.adapter.sendRequest(request, self.reloadAndRefreshList);
    };

    /**
     * Send request to restart all running instances.
     */
    this.restartAllInstances = function restartAllInstances() {
        var request = new yak.api.RestartAllRunningInstancesRequest();
        context.adapter.sendRequest(request, self.reloadAndRefreshList);
    };

    /**
     * Stop instance.
     * @param {string} id
     */
    this.stopInstance = function stopInstance(id) {
        var request = new yak.api.StopInstanceRequest();
        request.instanceId = id;
        context.adapter.sendRequest(request, self.reloadAndRefreshList);
    };

    /**
     * Restart instance.
     * @param {string} id
     */
    this.restartInstance = function restartInstance(id) {
        var request = new yak.api.RestartInstanceRequest();
        request.instanceId = id;
        context.adapter.sendRequest(request, self.reloadAndRefreshList);
    };

    /**
     * Show and activate the instance edit panel.
     * @param {yak.api.InstanceInfo} [item]
     */
    this.activateInstanceEditPanel = function activateInstanceEditPanel(item) {
        context.eventBus.post(new yak.ui.ShowViewCommand(yak.ui.InstanceView, item));
    };

    /**
     * Reload and refresh list.
     */
    this.reloadAndRefreshList = function reloadAndRefreshList() {
        context.adapter.sendRequest(new yak.api.GetInstancesRequest(), handleGetInstancesResponse);
    };

    /**
     * @param {yak.api.GetInstancesResponse} response
     */
    function handleGetInstancesResponse(response) {
        console.log('handleGetInstancesResponse', {response: response});

        self.items = _.map(response.instances, toInstanceItem);
        self.items = self.items.sort(yak.ui.nameCompare);

        self.onItemsChanged();
    }

    /**
     * @param {!yak.api.InstanceInfo} instanceInfo
     * @returns {!yak.ui.InstanceInfoItem}
     */
    function toInstanceItem(instanceInfo) {
        var instanceItem = new yak.ui.InstanceInfoItem(instanceInfo.id);
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
};
