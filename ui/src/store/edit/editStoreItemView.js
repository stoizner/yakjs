/* global CodeMirror:false */

/**
 * @constructor
 * @param {jQuery} parent
 * @param {yak.ui.ViewContext} context
 * @param {yak.ui.EditStoreItemViewModel} viewModel
 */
yak.ui.EditStoreItemView = function EditStoreItemView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.EditStoreItemView}
     */
    var self = this;

    /**
    * @type {null|CodeMirror}
    */
    var codeEditor = null;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('editStoreItem');

    /**
     * Constructor
     */
    function constructor() {
        initializeView();

        viewModel.onItemChanged = handleItemChanged;
    }

    function initializeView() {
        parent.html(template.build(viewModel));

        parent.find('[data-command=save]').click(save);
        parent.find('[data-command=delete]').click(handleDeleteCommand);
        parent.find('[data-command=refresh]').click(function() { viewModel.refresh(); });
        parent.find('[data-command=cancel]').click(handleCancelCommand);
        parent.find('[data-command=prettify-json]').click(handlePrettifyJsonCommand);

        parent.find('[data-command=maximize-editor]').click(maximizeCodeEditor);
        parent.find('[data-command=minimize-editor]').click(minimizeCodeEditor);

        CodeMirror.commands.quicksave = save;

        codeEditor = new CodeMirror($('#storeValueEditor')[0], {
            value:  '',
            mode:  {name: "javascript", json: true},
            lineNumbers: false,
            indentUnit: 4,
            extraKeys: { 'Ctrl-S': 'quicksave' }
        });

        codeEditor.on('change', function(instance) {
            determineCodeMirrorType(instance);
        });

        minimizeCodeEditor();
    }

    /**
     * Activate view
     * @param {string|object} [data]
     */
    this.activate = function activate(data) {
        viewModel.activate(data);
    };

    function determineCodeMirrorType(instance) {
        var switchModes = [checkAndSwitchToJSON, checkAndSwitchToMarkdown];

        var switched = switchModes.some(function(switchModeFunction) {
            return switchModeFunction(instance);
        });

        if (!switched) {
            instance.setOption('mode', 'text');
        }
    }

    /**
     * @param {CodeMirror} instance
     * @returns {boolean}
     */
    function checkAndSwitchToJSON(instance) {
        var switched = false;

        try {
            JSON.parse(instance.getValue());
            var mode = {name: "javascript", json: true};
            instance.setOption('mode', mode);
            console.log('Switched code editor to', {mode: mode});
            switched = true;
        } catch(ex) {
            switched = false;
        }

        return switched;
    }

    function checkAndSwitchToMarkdown(instance) {
        var switched = false;

        var code = instance.getValue();
        var mode = 'gfm';

        if (code.indexOf('#') >= 0) {
            instance.setOption('mode', mode);
            switched = true;
        }

        return switched;
    }

    /**
     * Get the current editor content and if it is JSON prettify it.
     */
    function handlePrettifyJsonCommand(event) {
        var jsonText = codeEditor.getValue();
        try {
            var json = JSON.parse(jsonText);

            var space = event.ctrlKey ? 2 : 4;
            var prettyJsonText = JSON.stringify(json, null, space);

            codeEditor.setValue(prettyJsonText);
        } catch (ex) {
            // Do nothing, maybe it is not a valid json.
        }
    }

    /**
     * Handle plugin item changed event.
     */
    function handleItemChanged() {
        initializeView();

        if (viewModel.isNewStoreItem) {
            codeEditor.setValue('');
        } else {
            codeEditor.setValue(viewModel.storeItem.value);
        }
    }

    function save() {
        console.warn('SAVE');
        var item = new yak.ui.StoreKeyValueItem(parent.find('[name=key]').val());
        item.value = codeEditor.getValue();

        viewModel.updateValue(item);
    }

    function handleCancelCommand() {
        viewModel.cancel();
    }

    function handleDeleteCommand() {
        viewModel.deleteStore();
    }

    /**
     * Maximizes the code editor and hides the config section.
     */
    function maximizeCodeEditor() {
        parent.find('[data-command=maximize-editor]').hide();
        parent.find('[data-command=minimize-editor]').show();

        parent.find('[data-section=config]').hide();
    }

    /**
     * Minimizes the code editor to available space.
     */
    function minimizeCodeEditor() {
        parent.find('[data-command=maximize-editor]').show();
        parent.find('[data-command=minimize-editor]').hide();

        parent.find('[data-section=config]').show();
    }

    constructor();
};
