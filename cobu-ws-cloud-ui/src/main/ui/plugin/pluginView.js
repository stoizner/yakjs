/**
 * PluginView
 * @class
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$|jQuery} parent
 */
cobu.wsc.ui.PluginView = function PluginView(parent, context) {
    'use strict';

    /** @type {cobu.wsc.ui.PluginView} */
    var self = this;

    /**
    * @type {null||cobu.wsc.service.PluginInfo}
    */
    var pluginInfo = null;

    /**
    * @type {null|CodeMirror}
    */
    var codeEditor = null;

    /**
     * @type {string}
     */
    var pluginCodeTemplate = cobu.wsc.ui.EmptyPluginTemplate.toString();

    /** Constructor */
    function constructor() {
        $('#plugin-save', parent).click(handleSaveClick);

        context.eventBus.on(cobu.wsc.service.CreatePluginResponse).register(handleResponse);
        context.eventBus.on(cobu.wsc.service.UpdatePluginResponse).register(handleResponse);

        CodeMirror.commands.autocomplete = cobu.wsc.ui.codeEditorAutoComplete;
        CodeMirror.commands.autodocument = cobu.wsc.ui.codeEditorAutoDocument;

        codeEditor = CodeMirror($('#codeEditor')[0], {
            value:  '',
            mode:  'javascript',
            lineNumbers: false,
            indentUnit: 4,
            extraKeys: { 'Ctrl-Space': 'autocomplete', 'Ctrl-D': 'autodocument' }
        });
    }

    /**
    * Activate view
    * @param {string|object} data
    */
    this.active = function active(data) {
        console.log('InstanceView active', data);

        $('.error-line', parent).hide();

        if (data !== null) {
            pluginInfo = data;
        } else {
            pluginInfo = null;
        }

        self.update();
    };

    /**
     * Update DOM.
     */
    this.update = function update() {
        if (pluginInfo === null) {
            $('[data-bind]', parent).val('');
            codeEditor.setValue(pluginCodeTemplate);
        } else {
            $('[data-bind]', parent).each(function() {
                var element = $(this);
                var name = element.attr('data-bind');
                element.val(pluginInfo[name]);
            });

            codeEditor.setValue(pluginInfo.code);
        }
    };

    /**
     * @param {cobu.wsc.service.CreateInstanceResponse} response
     */
    function handleResponse(response) {
        console.log('handleResponse', response);

        var errorLine = $('.error-line', parent);

        if (response.success) {
            context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-plugin'));
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

        if (pluginInfo === null) {
            request = new cobu.wsc.service.CreatePluginRequest();
            $.extend(request, data);
        } else {
            request = new cobu.wsc.service.UpdatePluginRequest();
            $.extend(request, data);
            request.pluginName = pluginInfo.name;
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

        data.code = codeEditor.getValue();

        return data;
    }

    constructor();
};