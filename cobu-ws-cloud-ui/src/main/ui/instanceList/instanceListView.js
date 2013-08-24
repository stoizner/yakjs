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

   /** Constructor */
   function constructor() {
      context.eventBus.on(cobu.wsc.service.GetInstancesResponse).register(handleGetInstancesResponse);
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
   };

   constructor();
};