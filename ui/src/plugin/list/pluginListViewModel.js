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
     * @type {Array<yak.ui.PluginItem>}
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
        console.log('yak.ui.PluginListViewModel.constructor');
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('yak.ui.PluginListViewModel.active');
        context.adapter.sendRequest(new yak.api.GetPluginsRequest(), handleGetPluginsResponse);
    };

    /**
     * Delete plugin.
     * @param {string} name
     */
    this.deletePlugin = function deletePlugin(name) {
        var request = new yak.api.DeletePluginRequest();
        request.pluginName = name;
        context.adapter.sendRequest(request, handleDeletePluginResponse);
    };

    /**
     * Show and activate the plugin edit panel.
     * @param {string} [name]
     */
    this.activatePluginEditPanel = function activatePluginEditPanel(name) {
        var item = null;

        if (name) {
            item = _.findWhere(self.items, {name: name});
        }

        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-plugin-edit', item));
    };

    /**
     * Reload and refresh list.
     */
    this.reloadAndRefreshList = function reloadAndRefreshList() {
        // SMELL: Make the refresh not so brutal.
        context.adapter.sendRequest(new yak.api.GetPluginsRequest(), handleGetPluginsResponse);
    };

    /**
     *
     * @param {string} name The name of the plugin.
     * @param {string} code The plugin JavaScript code.
     */
    this.createOrUpdatePlugin = function createOrUpdatePlugin(name, code) {
        console.log('PluginListViewModel.createOrUpdatePlugin');
        var request = new yak.api.CreateOrUpdatePluginRequest();
        request.name = name;
        request.code = code;
        request.description = '';
        context.adapter.sendRequest(request, self.reloadAndRefreshList);
    };

    /**
     * @param {yak.api.GetPluginsResponse} response
     */
    function handleGetPluginsResponse(response) {
        console.log('handleGetPluginsResponse', response);

        self.items = [];
        _.each(response.plugins, function toItem(plugin) {
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
