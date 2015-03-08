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
     * @type {yak.ui.AppBarView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('appBar');

    /**
     * Constructor
     */
    function constructor() {
        parent.html(template.build({ version: yak.ui.version}));

        viewModel.onNotificationActiveChanged = showKnockoutAnimation;
    }

    /**
     * @param {boolean} enabled
     */
    function showKnockoutAnimation(enabled) {
        if (enabled) {
            $('.header-logo-stars-icon').show();
        } else {
            $('.header-logo-stars-icon').hide();
        }
    }

    constructor();
};
