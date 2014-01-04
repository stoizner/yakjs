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
        context.eventBus.on(yak.api.DeletePluginResponse).register(handleDeletePluginResponse);
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('yak.ui.PluginListViewModel.active');
        context.webSocket.send(new yak.api.GetPluginsRequest());
    };

    /**
     * Delete plugin.
     * @param {string} name
     */
    this.deletePlugin = function deletePlugin(name) {
        context.webSocket.send(new yak.api.DeletePluginRequest(), { pluginName: name });
    };

    /**
     * Show and activate the plugin edit panel.
     * @param {yak.ui.PluginItem} [item]
     */
    this.activatePluginEditPanel = function activatePluginEditPanel(item) {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-plugin-edit', item));
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
     * @param {yak.DeletePluginResponse} response
     */
    function handleDeletePluginResponse(response) {
        console.log('handleDeletePluginResponse', response);
        self.reloadAndRefreshList();
    }

    constructor();
};