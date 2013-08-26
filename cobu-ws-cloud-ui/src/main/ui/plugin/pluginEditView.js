/**
 * PluginEditView
 * @class
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$|jQuery} parent
 */
cobu.wsc.ui.PluginEditView = function PluginEditView(parent, context) {
   'use strict';

   /** @type {cobu.wsc.ui.PluginEditView} */
   var self = this;

   /** Constructor */
   function constructor() {
   }

   this.active = function active() {
      console.log('PluginEditView.active');
   };

   constructor();
};