/* global CodeMirror:false */

/**
 * @constructor
 * @param {jQuery} parent
 * @param {yak.ui.ViewContext} context
 * @param {yak.ui.ModuleDetailViewModel} viewModel
 */
yak.ui.ModuleDetailView = function ModuleDetailView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('moduleDetailView');

    /**
     * Constructor
     */
    function constructor() {
        initializeView();

        viewModel.onItemChanged = handleItemChanged;
    }

    function initializeView() {
        parent.html(template.build(viewModel));

        parent.find('[data-command=delete]').click(handleDeleteCommand);
        parent.find('[data-command=cancel]').click(handleCancelCommand);
    }

    /**
     * Activate view
     * @param {string|object} [data]
     */
    this.activate = function activate(data) {
        viewModel.activate(data);
    };

    /**
     * Handle plugin item changed event.
     */
    function handleItemChanged() {
        initializeView();
    }

    function handleCancelCommand() {
        viewModel.cancel();
    }

    function handleDeleteCommand() {
        viewModel.deleteModule();
    }

    constructor();
};
