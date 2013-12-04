/**
 * InstanceView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {$} parent
 */
yak.ui.InstanceView = function InstanceView(parent, context) {
    'use strict';

    /** @type {yak.ui.InstanceView} */
    var self = this;

    /**
    * @type {null|yak.api.InstanceInfo}
    */
    var instanceInfo = null;

    /**
     * Constructor
     */
    function constructor() {
        $('#instance-save', parent).click(handleSaveClick);
        context.eventBus.on(yak.api.CreateInstanceResponse).register(handleResponse);
        context.eventBus.on(yak.api.UpdateInstanceResponse).register(handleResponse);
    }

    /**
     * Activate view
     * @param {string|object} data
     */
    this.active = function active(data) {
        console.log('InstanceView active', data);

        $('.error-line', parent).hide();

        if (data !== null) {
            instanceInfo = data;
        } else {
            instanceInfo = null;
        }

        self.update();
    };

    /**
     * Update form.
     */
    this.update = function update() {
        if (instanceInfo === null) {
            $('[data-bind]', parent).val('');
        } else {
            $('[data-bind]', parent).each(function() {
                var element = $(this);
                var name = element.attr('data-bind');
                element.val(instanceInfo[name]);
            });

            $('[data-bind="pluginsCsv"]', parent).val(instanceInfo.plugins.join(','));
        }
    };

    /**
     * @param {yak.api.CreateInstanceResponse} response
     */
    function handleResponse(response) {
        console.log('handleResponse', response);

        var errorLine = $('.error-line', parent);
        if (response.success) {
            context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-instance'));
            errorLine.hide();
        } else {
            errorLine.show();
            $('.error-line-text', errorLine).html(response.message.replace(/\n/g, '<br />'));
        }
    }

    /**
     * Handle Create Click
     */
    function handleSaveClick() {
        var data = bind();

        console.log(data);

        var request = null;

        if (instanceInfo === null) {
            request = new yak.api.CreateInstanceRequest();
            $.extend(request, data);
            request.plugins = data.pluginsCsv.split(',');
        } else {
            request = new yak.api.UpdateInstanceRequest();
            $.extend(request, data);
            request.plugins = data.pluginsCsv.split(',');
            request.instanceName = instanceInfo.name;
        }

        $.extend(request, data);
        context.webSocket.send(request);
    }

    /**
     * Bind from form
     * @returns {{}}
     */
    function bind() {

        var data = {};

        $('[data-bind]', parent).each(function() {
            var element = $(this);
            var name = element.attr('data-bind');
            data[name] = element.val();
        });

        return data;
    }

    constructor();
};