/**
 * AppBarView
 * @constructor
 * @param {$} parent
 * @param {yak.ui.ViewContext} context
 * @param {yak.ui.AppBarViewModel} viewModel
 */
yak.ui.AppBarView = function AppBarView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('appBar');

    /**
     * Constructor
     */
    function constructor() {
        viewModel.onVersionCheckResultChanged = updateAppBar;
        updateAppBar();
    }

    function updateAppBar() {
        console.warn(viewModel.versionCheckResult);
        parent.html(template.build({
            version: yak.ui.appInfo.version,
            versionCheck: viewModel.versionCheckResult
        }));
    }

    constructor();
};
