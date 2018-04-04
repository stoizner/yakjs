const PluginItem = require('../pluginItem');
const PluginView = require('../edit/pluginView');
const ShowViewCommand = require('../../workspace/showViewCommand');
const Subject = require('../../core/subject');
const compareId = require('../../core/compare/compareId');

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
     * @type {!Subject<!Array<!PluginItem>>}
     */
    this.items = new Subject([]);

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
            item = self.items.value.find(item => item.id === id);
        }

        context.eventBus.post(new ShowViewCommand(PluginView, item));
    };

    this.reload = function reload() {
        context.adapter.get('/plugins').then(handleGetPluginsResponse);
    };

    /**
     * @param {!Object} response
     */
    function handleGetPluginsResponse(response) {
        console.log('handleGetPluginsResponse', response);

        let listItems = response.plugins.map(plugin => Object.assign(new PluginItem(), plugin));
        self.items.set(listItems.sort(compareId));
    }

    constructor();
}

module.exports = PluginListViewModel;
