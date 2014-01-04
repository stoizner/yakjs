/**
 * InstanceViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.InstanceViewModel = function InstanceViewModel(context) {
    'use strict';

    /** @type {yak.ui.InstanceViewModel} */
    var self = this;

    /**
    * @type {yak.ui.InstanceItem}
    */
    this.instanceItem = null;

    /**
     * @type {Function}
     */
    this.onInstanceInfoChanged = yak.ui.noop;

    /**
     * Constructor
     */
    function constructor() {
        context.eventBus.on(yak.api.CreateInstanceResponse).register(handleResponse);
        context.eventBus.on(yak.api.UpdateInstanceResponse).register(handleResponse);
    }

    /**
     * Activate view
     * @param {string|object} data
     */
    this.activate = function activate(data) {
        console.log('InstanceViewModel.activate', data);

        if (data !== null) {
            self.instanceItem = new yak.ui.InstanceItem();
            _.extend(self.instanceItem, data);
        } else {
            self.instanceItem = null;
        }

        self.onInstanceInfoChanged();
    };

    /**
     * Create or update a new websocket instance.
     * @param {yak.ui.InstanceItem} instance
     */
    this.createOrUpdate = function createOrUpdate(instance) {
        console.log('InstanceViewModel.createOrUpdate', instance);
        var request = null;

        if (self.instanceItem === null) {
            request = new yak.api.CreateInstanceRequest();
            $.extend(request, instance);
        } else {
            request = new yak.api.UpdateInstanceRequest();
            $.extend(request, instance);
            request.instanceName = self.instanceItem.name;
        }

        context.webSocket.send(request);
    };

    /**
     * Cancel instance edit.
     */
    this.cancel = function cancel() {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-instance'));
    };

    /**
     * @param {yak.api.CreateInstanceResponse} response
     */
    function handleResponse(response) {
        console.log('handleResponse', response);

        if (response.success) {
            context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-instance'));
        }
    }

    constructor();
};