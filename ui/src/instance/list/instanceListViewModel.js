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
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-instance-edit', item));
    };

    /**
     * Reload and refresh list.
     */
    this.reloadAndRefreshList = function reloadAndRefreshList() {
        // SMELL: Make the refresh not so brutal.
        context.adapter.sendRequest(new yak.api.GetInstancesRequest(), handleGetInstancesResponse);
    };

    /**
     * @param {yak.api.GetInstancesResponse} response
     */
    function handleGetInstancesResponse(response) {
        console.log('handleGetInstancesResponse', {response: response});

        self.items = response.instances;
        self.onItemsChanged();
    }

    constructor();
};
