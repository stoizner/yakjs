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

        parent.find('[data-command=save]').click(handleSaveCommand);
        parent.find('[data-command=delete]').click(handleDeleteCommand);
        parent.find('[data-command=refresh]').click(function() { viewModel.refresh(); });
        parent.find('[data-command=cancel]').click(handleCancelCommand);
        parent.find('[data-command=prettify-json]').click(handlePrettifyJsonCommand);

        parent.find('[data-command=maximize-editor]').click(maximizeCodeEditor);
        parent.find('[data-command=minimize-editor]').click(minimizeCodeEditor);

        codeEditor = new CodeMirror($('#storeValueEditor')[0], {
            value:  '',
            mode:  'json',
            lineNumbers: false,
            indentUnit: 4,
            extraKeys: {}
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

    /**
     * Get the current editor content and if it is JSON prettify it.
     */
    function handlePrettifyJsonCommand() {
        var jsonText = codeEditor.getValue();
        try {
            var json = JSON.parse(jsonText);
            var prettyJsonText = JSON.stringify(json, null, 2);

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

    function handleSaveCommand() {
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
