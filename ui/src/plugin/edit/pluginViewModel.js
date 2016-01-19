/**
 * ViewModel for editing a plugin.
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.PluginViewModel = function PluginViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.PluginViewModel}
     */
    var self = this;

    /**
     * @type {yak.ui.PluginItem}
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
     * @param {string|object} data
     */
    this.activate = function activate(data) {
        console.log('PluginViewModel.activate', data);

        if (data !== null) {
            self.pluginItem = new yak.ui.PluginItem();
            _.extend(self.pluginItem, data);
        } else {
            self.pluginItem = null;
        }

        self.onPluginItemChanged();
    };

    /**
     * Create or update a plugin
     * @param {yak.ui.PluginItem} instance
     */
    this.createOrUpdate = function createOrUpdate(instance) {
        console.log('PluginViewModel.createOrUpdate', { instance: instance });
        var request = null;

        if (self.pluginItem === null) {
            request = new yak.api.CreatePluginRequest();
            $.extend(request, instance);
        } else {
            request = new yak.api.UpdatePluginRequest();
            $.extend(request, instance);
            request.pluginName = self.pluginItem.name;
        }

        context.adapter.sendRequest(request, handleResponse);
    };

    /**
     * Cancel instance edit.
     */
    this.cancel = function cancel() {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-plugin'));
    };

    /**
     * @param {string} name
     */
    this.deletePlugin = function deletePlugin() {
        if (self.pluginItem) {
            var request = new yak.api.DeletePluginRequest();
            request.pluginName = self.pluginItem.name;
            context.adapter.sendRequest(request, showPluginPanel);
        }
    };

    function showPluginPanel() {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-plugin'));
    }

    /**
     * @param {yak.api.CreateInstanceResponse} response
     */
    function handleResponse(response) {
        console.log('handleResponse', response);

        if (response.success) {
            showPluginPanel();
        } else {
            self.onErrorResponse(response.message);
        }
    }
};
