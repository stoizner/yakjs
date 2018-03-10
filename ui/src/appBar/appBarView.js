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
    const template = context.template.load('appBar');

    function constructor() {
        viewModel.versionInfo.subscribeAndInvoke(updateAppBar);
    }

    /**
     * @param {Object} versionInfo
     */
    function updateAppBar(versionInfo) {
        parent.html(template.build({versionInfo}));
    }

    constructor();
}

module.exports = AppBarView;
