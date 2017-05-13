var PluginItem = require('../pluginItem');
var PluginView = require('../edit/pluginView');
var ShowViewCommand = require('../../workspace/showViewCommand');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function PluginListViewModel(context) {
    'use strict';

    /**
     * @type {!PluginListViewModel}
     */
    var self = this;

    /**
     * @type {!Array<!PluginItem>}
     */
    this.items = [];

    /**
     * @type {Function}
     */
    this.onItemsChanged = _.noop;

    function constructor() {
        console.log('PluginListViewModel.constructor');
    }

    this.activate = function activate() {
        console.log('PluginListViewModel.active');
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

        context.eventBus.post(new ShowViewCommand(PluginView, item));
    };

    this.reloadAndRefreshList = function reloadAndRefreshList() {
        context.adapter.get('/plugins').then(handleGetPluginsResponse);
    };

    /**
     * @param {GetPluginsResponse} response
     */
    function handleGetPluginsResponse(response) {
        console.log('handleGetPluginsResponse', response);

        self.items = _.map(response.plugins, function toItem(plugin) {
            var item = new PluginItem();
            _.extend(item, plugin);
            return item;
        });

        self.onItemsChanged();
    }

    constructor();
}

module.exports = PluginListViewModel;
