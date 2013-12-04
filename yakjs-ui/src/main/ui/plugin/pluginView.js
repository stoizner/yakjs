/**
 * PluginView
 * @class
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {$|jQuery} parent
 */
yak.ui.PluginView = function PluginView(parent, context) {
    'use strict';

    /**
     * @type {yak.ui.PluginView}
     */
    var self = this;

    /**
     * @type {null||yak.api.PluginInfo}
     */
    var pluginInfo = null;

    /**
    * @type {null|CodeMirror}
    */
    var codeEditor = null;

    /**
     * @type {string}
     */
    var pluginCodeTemplate = yak.ui.EmptyPluginTemplate.toString();

    /**
     * Constructor
     */
    function constructor() {
        $('#plugin-save', parent).click(handleSaveClick);

        context.eventBus.on(yak.api.CreatePluginResponse).register(handleResponse);
        context.eventBus.on(yak.api.UpdatePluginResponse).register(handleResponse);

        CodeMirror.commands.autocomplete = yak.ui.codeEditorAutoComplete;
        CodeMirror.commands.autodocument = yak.ui.codeEditorAutoDocument;

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
     * @param {yak.api.CreateInstanceResponse} response
     */
    function handleResponse(response) {
        console.log('handleResponse', response);

        var errorLine = $('.error-line', parent);

        if (response.success) {
            context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-plugin'));
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
            request = new yak.api.CreatePluginRequest();
            $.extend(request, data);
        } else {
            request = new yak.api.UpdatePluginRequest();
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