/**
 * PluginViewModel
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
    this.onPluginItemChanged = yak.ui.noop;

    /**
     * Constructor
     */
    function constructor() {
    }

    /**
     * Activate view
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
     * Create or update a plugin for a websocket instance.
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

        context.webSocket.sendRequest(request, handleResponse);
    };

    /**
     * Cancel instance edit.
     */
    this.cancel = function cancel() {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-plugin'));
    };

    /**
     * @param {yak.api.CreateInstanceResponse} response
     */
    function handleResponse(response) {
        console.log('handleResponse', response);

        if (response.success) {
            context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-plugin'));
        }
    }

    constructor();
};