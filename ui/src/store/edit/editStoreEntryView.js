/* global CodeMirror:false */

/**
 * @constructor
 * @param {jQuery} parent
 * @param {yak.ui.ViewContext} context
 * @param {yak.ui.EditStoreEntryViewModel} viewModel
 */
yak.ui.EditStoreEntryView = function EditStoreEntryView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.PluginView}
     */
    var self = this;

    /**
    * @type {null|CodeMirror}
    */
    var codeEditor = null;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('editStoreEntry');

    /**
     * Form:  Key of the store entry
     */
    this.key = context.ko.observable('');

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.EditStoreEntryView.constructor', self);
        parent.html(template.build());

        viewModel.onItemChanged = handleItemChanged;
        context.ko.applyBindings(self, parent[0]);

        parent.find('[data-command=save]').click(handleSaveCommand);
        parent.find('[data-command=delete]').click(handleDeleteCommand);
        parent.find('[data-command=cancel]').click(handleCancelCommand);

        CodeMirror.commands.autocomplete = yak.ui.codeEditorAutoComplete;
        CodeMirror.commands.autodocument = yak.ui.codeEditorAutoDocument;

        codeEditor = new CodeMirror($('#storeValueEditor')[0], {
            value:  '',
            mode:  'json',
            lineNumbers: false,
            indentUnit: 4,
            extraKeys: { 'Ctrl-Space': 'autocomplete', 'Ctrl-D': 'autodocument' }
        });
    }

    /**
     * Activate view
     * @param {string|object} [data]
     */
    this.activate = function activate(data) {
        $('.error-line', parent).hide();
        viewModel.activate(data);
    };

    /**
     * Handle plugin item changed event.
     */
    function handleItemChanged() {
        if (viewModel.item) {
            self.key(viewModel.item.key);
            if (viewModel.item.value) {
                codeEditor.setValue(viewModel.item.value);
            } else {
                codeEditor.setValue('');
            }
        } else {
            self.key('');
            codeEditor.setValue('');
        }
    }

    function handleSaveCommand() {
        var item = new yak.ui.StoreItem(self.key());
        item.value = codeEditor.getValue();

        viewModel.createOrUpdate(item);
    }

    function handleCancelCommand() {
        viewModel.cancel();
    }

    function handleDeleteCommand() {
        viewModel.deleteStore();
    }

    constructor();
};
