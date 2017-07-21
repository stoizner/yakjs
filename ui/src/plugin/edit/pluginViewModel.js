var PluginItem = require('../pluginItem');
var ShowViewCommand = require('../../workspace/showViewCommand');
var PluginListView = require('../list/pluginListView');

var loadTemplate = require('../../core/template/loadTemplate');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function PluginViewModel(context) {
    'use strict';

    /**
     * @type {!PluginViewModel}
     */
    var self = this;

    /**
     * @type {PluginItem}
     */
    this.pluginItem = null;

    /**
     * @type {Function}
     */
    this.onPluginItemChanged = _.noop;

    /**
     * Callback for received error response.
     * @type {function(string)}
     */
    this.onErrorResponse = _.noop;

    /**
     * @type {boolean}
     */
    this.isNewItem = false;

    /**
     * @param {string|object} data
     */
    this.activate = function activate(data) {
        console.log('PluginViewModel.activate', data);

        if (data !== null) {
            self.pluginItem = new PluginItem();
            _.extend(self.pluginItem, data);
        } else {
            self.isNewItem = true;
            self.pluginItem = new PluginItem();
            self.pluginItem.code = loadTemplate('emptyPluginTemplate').build();
        }

        Object.freeze(self.pluginItem);

        self.onPluginItemChanged();
    };

    /**
     * Create or update a plugin
     * @param {PluginItem} pluginItem
     */
    this.createOrUpdate = function createOrUpdate(pluginItem) {
        console.log('PluginViewModel.createOrUpdate', {pluginItem: pluginItem});
        var request = {};

        // Preserve the original plugin ID so the ID can be updated.
        if (!self.isNewItem) {
            request.pluginId = self.pluginItem.id;
        }

        request.plugin = pluginItem;

        if (self.isNewItem) {
            context.adapter
                .post('/plugins', request)
                .then(showPluginPanel)
                .catch(showErrorMessage);
        } else {
            context.adapter
                .put('/plugins/' + self.pluginItem.id, request)
                .then(showPluginPanel)
                .catch(showErrorMessage);
        }

    };

    this.cancel = function cancel() {
        context.eventBus.post(new ShowViewCommand(PluginListView));
    };

    this.deletePlugin = function deletePlugin() {
        if (self.pluginItem) {
            context.adapter
                .deleteResource('/plugins/' + self.pluginItem.id)
                .then(showPluginPanel)
                .catch(showErrorMessage);
        }
    };

    function showPluginPanel() {
        context.eventBus.post(new ShowViewCommand(PluginListView));
    }

    function showErrorMessage(error) {
        self.onErrorResponse(error.message);
    }
}

module.exports = PluginViewModel;
