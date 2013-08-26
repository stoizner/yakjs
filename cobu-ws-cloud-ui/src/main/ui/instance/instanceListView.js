/**
 * InstanceListView
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$} parent
 */
cobu.wsc.ui.InstanceListView = function InstanceListView(parent, context)
{
   'use strict';

   /** @type {cobu.wsc.ui.InstanceListView} */
   var self = this;

   var itemTemplate = Mustache.compile($('#instance-item-tpl').html());

   var itemContainer = $('.instance-items', parent);

   var listItems = [];

   var contextMenuActions = {};

   /** Constructor */
   function constructor() {
      context.eventBus.on(cobu.wsc.service.GetInstancesResponse).register(handleGetInstancesResponse);
      context.eventBus.on(cobu.wsc.service.StartInstanceResponse).register(handleStartInstancesResponse);
      context.eventBus.on(cobu.wsc.service.StopInstanceResponse).register(handleStopInstancesResponse);

      contextMenuActions['edit'] = handleContextMenuEdit;
      contextMenuActions['start'] = handleContextMenuStart;
      contextMenuActions['stop'] = handleContextMenuStop;
      contextMenuActions['delete'] = handleContextMenuDelete;

      $('#instance-refresh').click(handleButtonRefreshClick);
      $('#instance-new').click(function() { context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-instance-new')); });
   }

   /**
    *
    */
   function handleButtonRefreshClick() {
      context.webSocket.send(new cobu.wsc.service.GetInstancesRequest());
   }

   /**
    * @param {cobu.wsc.service.StartInstanceResponse} response
    */
   function handleStartInstancesResponse(response) {
      context.webSocket.send(new cobu.wsc.service.GetInstancesRequest());
   }

   /**
    * @param {cobu.wsc.service.StopInstanceResponse} response
    */
   function handleStopInstancesResponse(response) {
      context.webSocket.send(new cobu.wsc.service.GetInstancesRequest());
   }

   /**
    * Activate View
    */
   this.active = function active() {
      context.webSocket.send(new cobu.wsc.service.GetInstancesRequest());
   };

   /**
    * @param {cobu.wsc.service.GetInstancesResponse} event
    */
   function handleGetInstancesResponse(response) {
      console.log('handleGetInstancesResponse');

      listItems = response.instances;
      self.update();
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

      $('.instance-item', itemContainer).contextMenu($('#instance-item-context'), handleMenuClicked);
   };

   /**
    * @param event
    * @param context
    */
   function handleMenuClicked(context, event) {

      var instanceName = context.attr('data-instance');
      var menuAction = $(event.target).attr('data-menu');

      if (contextMenuActions.hasOwnProperty(menuAction)) {
         contextMenuActions[menuAction](instanceName)
      } else {
         console.warn("No context menu handler found for " + menuAction);
      }
   }

   /**
    *
    * @param instanceName
    */
   function handleContextMenuEdit(instanceName) {

   }

   /**
    *
    * @param instanceName
    */
   function handleContextMenuStart(instanceName) {
      var request = new cobu.wsc.service.StartInstanceRequest();
      request.instanceName = instanceName;
      context.webSocket.send(request);
   }

   /**
    *
    * @param instanceName
    */
   function handleContextMenuStop(instanceName) {
      var request = new cobu.wsc.service.StopInstanceRequest();
      request.instanceName = instanceName;
      context.webSocket.send(request);
   }

   /**
    *
    * @param instanceName
    */
   function handleContextMenuDelete(instanceName) {

   }

   constructor();
};