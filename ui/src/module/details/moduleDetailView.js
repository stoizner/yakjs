/* global CodeMirror:false */

/**
 * @constructor
 * @struct
 * @param {jQuery} parent
 * @param {ViewContext} context
 * @param {ModuleDetailViewModel} viewModel
 */
function ModuleDetailView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {Template}
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
}

module.exports = ModuleDetailView;
