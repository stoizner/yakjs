/**
 * PluginListViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.PluginListViewModel = function PluginListViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.PluginListViewModel}
     */
    var self = this;

    /**
     * @type {!Array<!yak.ui.PluginItem>}
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
     * @param {string} [id]
     */
    this.activatePluginEditPanel = function activatePluginEditPanel(id) {
        var item = null;

        if (id) {
            item = _.findWhere(self.items, {id: id});
        }

        context.eventBus.post(new yak.ui.ShowViewCommand(yak.ui.PluginView, item));
    };

    /**
     * Reload and refresh list.
     */
    this.reloadAndRefreshList = function reloadAndRefreshList() {
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

        self.items = _.map(response.plugins, function toItem(plugin) {
            var item = new yak.ui.PluginItem();
            _.extend(item, plugin);
            return item;
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
