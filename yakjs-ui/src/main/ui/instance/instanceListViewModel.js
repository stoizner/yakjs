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
     * @type {Array.<yak.api.InstanceInfo>}
     */
    this.items = [];

    /**
     * @type {Function}
     */
    this.onItemsChanged = yak.ui.noop;

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.InstanceListViewModel.constructor');
        context.eventBus.on(yak.api.GetInstancesResponse).register(handleGetInstancesResponse);
        context.eventBus.on(yak.api.StartInstanceResponse).register(self.reloadAndRefreshList);
        context.eventBus.on(yak.api.StopInstanceResponse).register(self.reloadAndRefreshList);
        context.eventBus.on(yak.api.DeleteInstanceResponse).register(self.reloadAndRefreshList);
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('yak.ui.InstanceListViewModel.active');
        context.webSocket.send(new yak.api.GetInstancesRequest());
    };

    /**
     * Start instance.
     * @param {string} name
     */
    this.startInstance = function startInstance(name) {
        context.webSocket.send(new yak.api.StartInstanceRequest(), { instanceName: name });
    };

    /**
     * Stop instance.
     * @param {string} name
     */
    this.stopInstance = function stopInstance(name) {
        context.webSocket.send(new yak.api.StopInstanceRequest(), { instanceName: name });
    };

    /**
     * Restart instance.
     * @param {string} name
     */
    this.restartInstance = function stopInstance(name) {
        context.webSocket.send(new yak.api.RestartInstanceRequest(), { instanceName: name });
    };

    /**
     * Delete instance.
     * @param {string} name
     */
    this.deleteInstance = function stopInstance(name) {
        context.webSocket.send(new yak.api.DeleteInstanceRequest(), { instanceName: name });
    };

    /**
     * Show and activate the instance edit panel.
     * @param {yak.api.InstanceInfo} [item]
     */
    this.activateInstanceEditPanel = function activateInstanceEditPanel(item) {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-instance-edit', item));
    };

    /**
     * Reload and refresh list.
     */
    this.reloadAndRefreshList = function reloadAndRefreshList() {
        // SMELL: Make the refresh not so brutal.
        context.webSocket.send(new yak.api.GetInstancesRequest());
    };

    /**
     * @param {yak.api.GetInstancesResponse} response
     */
    function handleGetInstancesResponse(response) {
        console.log('handleGetInstancesResponse');

        self.items = response.instances;
        self.onItemsChanged();
    }

    constructor();
};