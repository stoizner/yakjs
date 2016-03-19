/* global CodeMirror:false */

/**
 * PluginListView
 * @constructor
 * @param {jQuery} parent
 * @param {yak.ui.ViewContext} context
 * @param {yak.ui.PluginViewModel} viewModel
 */
yak.ui.PluginView = function PluginView(parent, context, viewModel) {
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
    var template = context.template.load('pluginEdit');

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.InstanceView.constructor', self);

        initializeView();

        viewModel.onPluginItemChanged = handlePluginItemChanged;
        viewModel.onErrorResponse = handleErrorResponse;
    }

    /**
     * Initializes the code editor.
     */
    function initializeCodeEditor() {
        CodeMirror.commands.autocomplete = yak.ui.codeEditorAutoComplete;
        CodeMirror.commands.autodocument = yak.ui.codeEditorAutoDocument;

        codeEditor = new CodeMirror(parent.find('[data-element=codeEditor]')[0], {
            value:  '',
            mode:  'javascript',
            lineNumbers: false,
            indentUnit: 4,
            extraKeys: { 'Ctrl-Space': 'autocomplete', 'Ctrl-D': 'autodocument' }
        });

        codeEditor.on('change', handleCodeEditorChange);
        codeEditor.on('cursorActivity', handleCodeCursorActivity);

        minimizeCodeEditor();
    }

    /**
     * Updates the view
     */
    function initializeView() {
        parent.html(template.build(viewModel));

        parent.find('[data-command=save]').click(handleSaveCommand);
        parent.find('[data-command=delete]').click(handleDeleteCommand);
        parent.find('[data-command=cancel]').click(handleCancelCommand);

        parent.find('[data-command=maximize-editor]').click(maximizeCodeEditor);
        parent.find('[data-command=minimize-editor]').click(minimizeCodeEditor);

        initializeCodeEditor();

        if (viewModel.pluginItem) {
            codeEditor.setValue(viewModel.pluginItem.code);
        }
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

    /**
     * @param {string} message
     */
    function handleErrorResponse(message) {
        var errorMessageElement = parent.find('[data-element=error-message]');
        errorMessageElement.show();
        errorMessageElement.find('.warning-text').html(message);
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
     * Handle if code in editor was change to perform a syntax check.
     * @param {string} doc
     * @param {string} change
     */
    function handleCodeEditorChange(doc, change) {
        try {
            var code = codeEditor.getValue();
            (function checkIfCodeThrowsError() {
                /*eslint-disable no-new-func */
                new Function('return ' + code)();
                /*eslint-enable no-new-func */
            })();
            updateEditorSyntaxError('none', '');
        } catch(ex) {
            console.log(ex);

            var title = 'Last code change was done near ' + change.from.line + ':' + change.from.ch;
            updateEditorSyntaxError('syntax', title);
        }
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

    /**
     * Handle plugin item changed event.
     */
    function handlePluginItemChanged() {
        console.log('InstanceView.handleInstanceInfoChanged', viewModel.instanceItem);
        initializeView();
    }

    /**
     * Handle Save Button Click
     */
    function handleSaveCommand() {
        var pluginItem = new yak.ui.PluginItem();
        pluginItem.id = parent.find('[name=id]').val();
        pluginItem.description = parent.find('[name=description]').val();
        pluginItem.code = codeEditor.getValue();
        pluginItem.version = parent.find('[name=version]').val();

        viewModel.updateValue(pluginItem);
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
};
