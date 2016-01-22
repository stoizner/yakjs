/**
 * InstanceViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.InstanceViewModel = function InstanceViewModel(context) {
    'use strict';

    /** @type {yak.ui.InstanceViewModel} */
    var self = this;

    /**
    * @type {yak.ui.InstanceItem}
    */
    this.instanceItem = null;

    /**
     * @type {Function}
     */
    this.onInstanceInfoChanged = _.noop;

    /**
     * @type {Array<yak.ui.SelectPluginItem>}
     */
    this.allPluginItems = [];

    /**
     *
     * @type {Array}
     */
    this.selectedPluginItems = [];

    /**
     *
     * @type {Array}
     */
    this.notSelectedPluginItems = [];

    /**
     * @type {Function}
     */
    this.onSelectPluginItemsChanged = _.noop;

    /**
     * Callback for received error response.
     * @type {function(string)}
     */
    this.onErrorResponse = _.noop;

    /**
     * Constructor
     */
    function constructor() {
    }

    /**
     * Activate view
     * @param {string|Object} data
     */
    this.activate = function activate(data) {
        console.log('InstanceViewModel.activate', data);

        self.instanceItem = data;

        self.onInstanceInfoChanged();

        context.adapter.sendRequest(new yak.api.GetPluginsRequest(), handleGetPluginsResponse);
    };

    /**
     * Delete instance.
     */
    this.deleteInstance = function deleteInstance() {
        var request = new yak.api.DeleteInstanceRequest();
        request.instanceId = self.instanceItem.id;
        context.adapter.sendRequest(request, showPanelInstanceList);
    };

    /**
     *
     * @param {yak.api.GetPluginsResponse} response
     */
    function handleGetPluginsResponse(response) {
        console.log('InstanceViewModel.handleGetPluginsResponse', {response: response});

        self.allPluginItems = [];

        _.each(response.plugins, function toItem(pluginsInfo) {
            var item = new yak.ui.SelectPluginItem();
            item.name = pluginsInfo.name;
            item.description = pluginsInfo.description;

            if (self.instanceItem && _.contains(self.instanceItem.plugins, item.name)) {
                item.isActive = true;
            }

            self.allPluginItems.push(item);
        });

        updateSelectedPluginItems();

        self.onSelectPluginItemsChanged();
    }

    /**
     * Updates selectedPluginItems and notSelectedPluginItems.
     */
    function updateSelectedPluginItems() {
        self.selectedPluginItems = _.where(self.allPluginItems, {isActive: true});
        self.notSelectedPluginItems = _.where(self.allPluginItems, {isActive: false});

        if (self.selectedPluginItems.length === 0) {
            // Add special placeholder item
            var placeholder = new yak.ui.SelectPluginItem();
            placeholder.name = 'No plugin selected...';
            placeholder.isActive = false;
            self.selectedPluginItems.push(placeholder);
        }
    }

    /**
     * Create or update a new websocket instance.
     * @param {yak.ui.InstanceItem} instanceItem
     */
    this.createOrUpdate = function createOrUpdate(instanceItem) {
        console.log('InstanceViewModel.createOrUpdate', {instanceItem: instanceItem});

        var request = null;

        if (self.instanceItem === null) {
            request = new yak.api.CreateInstanceConfigRequest();
            request.instance = _.extend(new yak.api.InstanceConfig(), instanceItem);
        } else {
            request = new yak.api.UpdateInstanceRequest();
            request.instance = _.extend(new yak.api.InstanceConfig(), instanceItem);
            request.instanceId = self.instanceItem.id;
        }

        request.instance.plugins = [];

        _.each(_.where(self.allPluginItems, { isActive: true }), function select(selectPluginItem) {
            request.instance.plugins.push(selectPluginItem.name);
        });

        context.adapter.sendRequest(request, handleInstanceResponse);
    };

    /**
     * Cancel instance edit.
     */
    this.cancel = function cancel() {
        showPanelInstanceList();
    };

    /**
     * Show the panel instance list.
     */
    function showPanelInstanceList() {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-instance'));
    }

    /**
     *
     * @param {string} pluginName
     */
    this.togglePluginSelection = function togglePluginSelection(pluginName) {
        console.log('InstanceViewModel.togglePluginSelection', pluginName);
        var pluginItem = _.findWhere(self.allPluginItems, {name: pluginName});
        pluginItem.isActive = !pluginItem.isActive;

        updateSelectedPluginItems();

        self.onSelectPluginItemsChanged();
    };

    /**
     * @param {yak.api.CreateInstanceResponse} response
     */
    function handleInstanceResponse(response) {
        console.log('InstanceViewModel.handleInstanceResponse', {response: response});

        if (response.success) {
            context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-instance'));
        } else {
            self.onErrorResponse(response.message);
        }
    }

    constructor();
};
