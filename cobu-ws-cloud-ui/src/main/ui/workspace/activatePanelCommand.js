/**
 * ActivatePanelCommand
 * @constructor
 * @param {string} name the panel name.
 */
cobu.wsc.ui.ActivatePanelCommand = function ActivatePanelCommand(name)
{
   'use strict';

   this.type="ui.command.activatePanel";

   /**
    * Name of the panel.
    * @type {string}
    */
   this.panelName = name;
};