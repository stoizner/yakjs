/**
 * HeaderView
 * @constructor
 * @param {$} parent
 * @param {yak.ui.ViewContext} context
 * @param {yak.ui.HeaderViewModel} viewModel
 */
yak.ui.HeaderView = function HeaderView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.HeaderView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('header');

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
