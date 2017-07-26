/* global CodeMirror:false */

var codeEditorAutoComplete = require('./codeEditorAutoComplete');
var codeEditorAutoDocument = require('./codeEditorAutoDocument');
var PluginItem = require('../pluginItem');
var MessageBox = require('../../widgets/messageBox');

/**
 * @constructor
 * @struct
 * @param {!jQuery} parent
 * @param {!ViewContext} context
 * @param {!PluginViewModel} viewModel
 */
function PluginView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {!PluginView}
     */
    var self = this;

    /**
    * @type {CodeMirror}
    */
    var codeEditor = null;

    /**
     * @type {!Template}
     */
    var template = context.template.load('pluginEdit');

    /**
     * @type {MessageBox}
     */
    var messageBox;

    function constructor() {
        console.log('InstanceView.constructor', self);

        initializeView();

        viewModel.onPluginItemChanged = handlePluginItemChanged;
        viewModel.onErrorResponse = messageBox.showWarning;
    }

    function initializeCodeEditor() {
        CodeMirror.commands.autocomplete = codeEditorAutoComplete;
        CodeMirror.commands.autodocument = codeEditorAutoDocument;
        CodeMirror.commands.quicksave = save;

        codeEditor = new CodeMirror(parent.find('[data-element=codeEditor]')[0], {
            value:  '',
            mode:  'javascript',
            lineNumbers: false,
            indentUnit: 4,
            extraKeys: { 'Ctrl-Space': 'autocomplete', 'Ctrl-D': 'autodocument', 'Ctrl-S': 'quicksave' }
        });

        codeEditor.on('cursorActivity', handleCodeCursorActivity);

        minimizeCodeEditor();
    }

    function initializeView() {
        parent.html(template.build(viewModel));

        parent.find('[data-element=save]').click(save);
        parent.find('[data-element=delete]').click(handleDeleteCommand);
        parent.find('[data-element=cancel]').click(handleCancelCommand);

        parent.find('[data-element=maximize-editor]').click(maximizeCodeEditor);
        parent.find('[data-element=minimize-editor]').click(minimizeCodeEditor);

        messageBox = new MessageBox(parent.find('[data-element=errorMessageBox]'));

        initializeCodeEditor();

        if (viewModel.pluginItem) {
            codeEditor.setValue(viewModel.pluginItem.code);
        }
    }

    /**
     * Maximizes the code editor and hides the config section.
     */
    function maximizeCodeEditor() {
        parent.find('[data-element=maximize-editor]').hide();
        parent.find('[data-element=minimize-editor]').show();

        parent.find('[data-section=config]').hide();
    }

    /**
     * Minimizes the code editor to available space.
     */
    function minimizeCodeEditor() {
        parent.find('[data-element=maximize-editor]').show();
        parent.find('[data-element=minimize-editor]').hide();

        parent.find('[data-section=config]').show();
    }

    /**
     * Display the current cursor position in the editor status bar.
     * @param {?} instance
     */
    function handleCodeCursorActivity(instance) {
        var cursorPosition = instance.getCursor();
        parent.find('[data-bind=editorCursorLine]').html(cursorPosition.line);
        parent.find('[data-bind=editorCursorColumn]').html(cursorPosition.ch);
    }

    /**
     * Updates the editor syntax error component.
     * @param {string} error
     * @param {string} title
     */
    function updateEditorSyntaxError(error, title) {
        parent.find('[data-editor-error]')
            .attr('data-editor-error', error)
            .attr('title', title);
    }

    /**
     * Activate view
     * @param {string|object} [data]
     */
    this.activate = function activate(data) {
        parent.find('.error-line').hide();
        viewModel.activate(data);
    };

    function handlePluginItemChanged() {
        initializeView();
    }

    /**
     * Handle Save Button Click
     */
    function save() {
        var pluginItem = new PluginItem();
        pluginItem.id = parent.find('[name=id]').val();
        pluginItem.code = codeEditor.getValue();

        if (pluginItem.id) {
            viewModel.createOrUpdate(pluginItem);
        } else {
            messageBox.showWarning('Please use a plugin name.');
        }
    }

    /**
     * Handle cancel button click
     */
    function handleCancelCommand() {
        viewModel.cancel();
    }

    /**
     * Handle delete click
     */
    function handleDeleteCommand() {
        viewModel.deletePlugin();
    }

    constructor();
}

module.exports = PluginView;
