/**
 * PluginListView
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$} parent
 */
cobu.wsc.ui.PluginListView = function PluginListView(parent, context) {
   'use strict';

   /** @type {cobu.wsc.ui.InstanceListView} */
   var self = this;

   var itemTemplate = Mustache.compile($('#plugin-item-tpl').html());

   var itemContainer = $('.plugin-items', parent);

   var pluginItems = [];

   var contextMenuActions = {};

   /** Constructor */
   function constructor() {
      context.eventBus.on(cobu.wsc.service.GetPluginsResponse).register(handleGetPluginsResponse);

      contextMenuActions['edit'] = handleContextMenuEdit;
      contextMenuActions['delete'] = handleContextMenuDelete;

      $('#plugin-refresh').click(handleButtonRefreshClick);
      $('#plugin-new').click(function() { context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-plugin-edit')); });
   }

   /**
    * Handle refresh button click
    */
   function handleButtonRefreshClick() {
      context.webSocket.send(new cobu.wsc.service.GetPluginsRequest());
   }

   /**
    * Activate View
    */
   this.active = function active() {
      context.webSocket.send(new cobu.wsc.service.GetPluginsRequest());
   };

   /**
    * @param {cobu.wsc.service.GetPluginsResponse} response
    */
   function handleGetPluginsResponse(response) {
      console.log('handleGetPluginsResponse', response);

      pluginItems = response.plugins;
      self.update();
   }

   /**
    * Update panel list
    */
   this.update = function update() {

      var html = '';

      for(var i=0; i<pluginItems.length; i++) {
         html += itemTemplate(pluginItems[i]);
      }

      itemContainer.html(html);

      $('.plugin-item', itemContainer).contextMenu($('#plugin-item-context'), handleMenuClicked);
   };

   /**
    * @param event
    * @param context
    */
   function handleMenuClicked(context, event) {

      var pluginName = context.attr('data-plugin');
      var menuAction = $(event.target).attr('data-menu');

      if (contextMenuActions.hasOwnProperty(menuAction)) {
         contextMenuActions[menuAction](pluginName)
      } else {
         console.warn("No context menu handler found for " + menuAction);
      }
   }

   /**
    *
    * @param pluginName
    */
   function handleContextMenuEdit(pluginName) {
   }

   /**
    *
    * @param pluginName
    */
   function handleContextMenuDelete(pluginName) {
   }

   constructor();
};