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

   var listItems = [];

   var contextMenuActions = {};

   /** Constructor */
   function constructor() {
      context.eventBus.on(cobu.wsc.service.GetPluginsResponse).register(handleGetPluginsResponse);
      context.eventBus.on(cobu.wsc.service.RemovePluginResponse).register(handleRemovePluginResponse);

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

      listItems = response.plugins;
      self.update();
   }

   /**
    * @param {cobu.wsc.service.RemovePluginResponse} response
    */
   function handleRemovePluginResponse(response) {
      console.log('handleRemovePluginResponse', response);
      context.webSocket.send(new cobu.wsc.service.GetPluginsRequest());
   }

   /**
    * Update panel list
    */
   this.update = function update() {

      var html = '';

      for(var i=0; i<listItems.length; i++) {
         html += itemTemplate(listItems[i]);
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
      var pluginInfo = null;

      for(var i=0; i<listItems.length; i++) {
         if (listItems[i].name === pluginName) {
            pluginInfo = listItems[i];
            break;
         }
      }

      context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-plugin-edit', pluginInfo));
   }

   /**
    *
    * @param {string} pluginName
    */
   function handleContextMenuDelete(pluginName) {
      var request = new cobu.wsc.service.RemovePluginRequest();
      request.pluginName = pluginName;
      context.webSocket.send(request);
   }

   constructor();
};