/**
 * InstanceNewView
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$} parent
 */
cobu.wsc.ui.InstanceNewView = function InstanceNewView(parent, context)
{
   'use strict';

   /** @type {cobu.wsc.ui.InstanceNewView} */
   var self = this;

   /** Constructor */
   function constructor()
   {
   }

   this.active = function active() {
      console.log('InstanceNewView active');
   };

   constructor();
};