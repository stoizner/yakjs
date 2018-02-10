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
        viewModel.onVersionInfoChanged = updateAppBar;
        updateAppBar();
    }

    function updateAppBar() {
        parent.html(template.build({
            versionInfo: viewModel.versionInfo
        }));
    }

    constructor();
}

module.exports = AppBarView;
