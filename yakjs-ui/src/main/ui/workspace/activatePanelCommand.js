/**
 * ActivatePanelCommand
 * @constructor
 * @param {string} name the panel name.
 * @param {string|object} [data]
 */
yak.ui.ActivatePanelCommand = function ActivatePanelCommand(name, data) {
    'use strict';

    this.type='ui.command.activatePanel';

    /**
     * Name of the panel.
     * @type {string}
     */
    this.panelName = name;

    /**
     *
     * @type {string|object}
     */
    this.data = data || null;
};