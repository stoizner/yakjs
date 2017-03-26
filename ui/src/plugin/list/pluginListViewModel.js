/** *
 * @constructor
 * @param {!yak.ui.ViewModelContext} context
 */
yak.ui.PluginListViewModel = function PluginListViewModel(context) {
    'use strict';

    /**
     * @type {!yak.ui.PluginListViewModel}
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

    function constructor() {
        console.log('yak.ui.PluginListViewModel.constructor');
    }

    this.activate = function activate() {
        console.log('yak.ui.PluginListViewModel.active');
        context.adapter.get('/plugins').then(handleGetPluginsResponse);
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

    this.reloadAndRefreshList = function reloadAndRefreshList() {
        context.adapter.get('/plugins').then(handleGetPluginsResponse);
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

    constructor();
};
