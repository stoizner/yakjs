/**
 * PluginListViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.PluginListViewModel = function PluginListViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.InstanceListViewModel}
     */
    var self = this;

    /**
     * @type {Array.<yak.ui.PluginItem>}
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
        console.log('yak.ui.PluginListViewModel.constructor');
        context.eventBus.on(yak.api.GetPluginsResponse).register(handleGetPluginsResponse);
        context.eventBus.on(yak.api.RemovePluginResponse).register(handleRemovePluginResponse);
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('yak.ui.PluginListViewModel.active');
        context.webSocket.send(new yak.api.GetPluginsRequest());
    };

    /**
     * Remove plugin.
     * @param {string} name
     */
    this.remove = function remove(name) {
        context.webSocket.send(new yak.api.RemovePluginRequest(), { pluginName: name });
    };

    /**
     * Show and activate the plugin edit panel.
     */
    this.activatePluginEditPanel = function activatePluginEditPanel() {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-instance-edit'));
    };

    /**
     * Reload and refresh list.
     */
    this.reloadAndRefreshList = function reloadAndRefreshList() {
        // SMELL: Make the refresh not so brutal.
        context.webSocket.send(new yak.api.GetPluginsRequest());
    };

    /**
     * @param {yak.api.GetPluginsResponse} response
     */
    function handleGetPluginsResponse(response) {
        console.log('handleGetPluginsResponse', response);

        self.items = [];
        _.each(response.plugins, function(plugin) {
            var item = new yak.ui.PluginItem();
            _.extend(item, plugin);
            self.items.push(item);
        });
        self.onItemsChanged();
    }

    /**
     * @param {yak.RemovePluginResponse} response
     */
    function handleRemovePluginResponse(response) {
        console.log('handleRemovePluginResponse', response);
        self.reloadAndRefreshList();
    }

    constructor();
};