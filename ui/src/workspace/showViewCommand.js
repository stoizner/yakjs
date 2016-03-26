/**
 * ActivatePanelCommand
 * @constructor
 * @param {Function} View The View to show.
 * @param {string|object} [data]
 */
yak.ui.ShowViewCommand = function ShowViewCommand(View, data) {
    'use strict';

    /**
     * @type {string}
     */
    this.type='yak.ui.ShowViewCommand';

    /**
     * @type {string}
     */
    this.ViewConstructor = View;

    /**
     * @type {string|object}
     */
    this.data = data || null;
};
