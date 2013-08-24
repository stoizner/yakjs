/**
 * WorkspaceView
 * @class
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$} parent
 */
cobu.wsc.ui.WorkspaceView = function WorkspaceView(parent, context)
{
   'use strict';

   /** @type {cobu.wsc.ui.WorkspaceView} */
   var self = this;

   var header = null;

   var instanceList = null;

   var panelViews = {};

   /** Constructor */
   function constructor() {

      header = new cobu.wsc.ui.HeaderView($('.header', parent), context);
      panelViews['panel-instance'] = new cobu.wsc.ui.InstanceListView($('.panel-instance', parent), context)

      $('.menu li', parent).click(handleMenuItemClick);
      hidePanels();
   }

   /**
    *
    * @param event
    */
   function handleMenuItemClick(event) {
      var target = $(event.currentTarget);
      var panelName = target.attr('data-panel');

      $('.menu li', parent).removeClass('state-active');
      target.addClass('state-active');

      hidePanels();
      $('.panels .'+panelName, parent).show();

      if (panelViews.hasOwnProperty(panelName)) {
         panelViews[panelName].active();
      }
   }

   /**
    * Hide all panels.
    */
   function hidePanels() {
      $('.panels .panel', parent).hide();
   }

   constructor();
};