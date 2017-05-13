/**
 * @constructor
 * @struct
 * @param {jQuery} parent
 * @param {!ViewContext} context
 * @param {!AppBarViewModel} viewModel
 */
function AppBarView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {Template}
     */
    var template = context.template.load('appBar');

    function constructor() {
        viewModel.onVersionCheckResultChanged = updateAppBar;
        viewModel.onVersionChanged = updateAppBar;
        updateAppBar();
    }

    function updateAppBar() {
        parent.html(template.build({
            version: viewModel.version,
            versionCheck: viewModel.versionCheckResult
        }));
    }

    constructor();
}

module.exports = AppBarView;
