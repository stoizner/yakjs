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
        parent.html(template.build({ version: yak.ui.version}));
    }

    constructor();
};
