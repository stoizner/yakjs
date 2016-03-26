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
    * @type {yak.ui.InstanceConfigItem}
    */
    this.instanceConfigItem = null;

    /**
     * @type {Function}
     */
    this.onInstanceConfigItemChanged = _.noop;

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
     * @param {yak.ui.InstanceInfoItem} data
     */
    this.activate = function activate(data) {
        console.log('InstanceViewModel.activate', {data: data});

        if (data) {
            self.instanceConfigItem = new yak.ui.InstanceConfigItem();
            self.instanceConfigItem.id = data.id;
            self.instanceConfigItem.description = data.description;
            self.instanceConfigItem.name = data.name;
            self.instanceConfigItem.port = data.port;
            self.instanceConfigItem.plugins = data.plugins;
        } else {
            self.instanceConfigItem = null;
        }

        self.onInstanceConfigItemChanged();

        context.adapter.sendRequest(new yak.api.GetPluginsRequest(), handleGetPluginsResponse);
    };

    /**
     * Delete instance.
     */
    this.deleteInstance = function deleteInstance() {
        var request = new yak.api.DeleteInstanceConfigRequest();
        request.instanceId = self.instanceConfigItem.id;
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
            item.name = pluginsInfo.id;
            item.description = pluginsInfo.description;

            if (self.instanceConfigItem && _.contains(self.instanceConfigItem.plugins, item.name)) {
                item.isActive = true;
            }

            self.allPluginItems.push(item);
        });

        updateSelectedPluginItems();
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

        self.onSelectPluginItemsChanged();
    }

    /**
     * Create or update a new websocket instance.
     * @param {!yak.ui.InstanceConfigItem} instanceConfigItem
     */
    this.createOrUpdate = function createOrUpdate(instanceConfigItem) {
        console.log('InstanceViewModel.createOrUpdate', {instanceConfigItem: instanceConfigItem});

        var request = null;

        var instanceConfig = new yak.api.InstanceConfig();

        if (self.instanceConfigItem === null) {
            request = new yak.api.CreateInstanceConfigRequest();
            _.extend(instanceConfig, instanceConfigItem);
        } else {
            request = new yak.api.UpdateInstanceConfigRequest();
            _.extend(instanceConfig, instanceConfigItem);
            request.instanceId = self.instanceConfigItem.id;
        }

        instanceConfig.plugins = [];

        _.each(_.where(self.allPluginItems, { isActive: true }), function select(selectPluginItem) {
            instanceConfig.plugins.push(selectPluginItem.name);
        });

        request.instance = instanceConfig;

        context.adapter.sendRequest(request, handleInstanceResponse);
    };

    /**
     * Cancel instance edit.
     */
    this.cancel = function cancel() {
        showPanelInstanceList();
    };

    /**
     * Uses all available plugins.
     */
    this.useAllPlugins = function useAllPlugins() {
        _.each(self.allPluginItems, function(item) {
            item.isActive = true;
        });

        updateSelectedPluginItems();
    };

    /**
     * Don't use any plugin.
     */
    this.useNoPlugins = function useNoPlugins() {
        _.each(self.allPluginItems, function(item) {
            item.isActive = false;
        });

        updateSelectedPluginItems();
    };

    /**
     * Show the panel instance list.
     */
    function showPanelInstanceList() {
        context.eventBus.post(new yak.ui.ShowViewCommand(yak.ui.InstanceListView));
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
    };

    /**
     * @param {yak.api.CreateInstanceConfigResponse} response
     */
    function handleInstanceResponse(response) {
        console.log('InstanceViewModel.handleInstanceResponse', {response: response});

        if (response.success) {
            context.eventBus.post(new yak.ui.ShowViewCommand(yak.ui.InstanceListView));
        } else {
            self.onErrorResponse(response.message);
        }
    }

    constructor();
};
