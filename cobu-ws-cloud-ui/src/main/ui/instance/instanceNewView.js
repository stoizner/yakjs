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
   function constructor() {

      $('#instance-create', parent).click(handleCreateClick);
      context.eventBus.on(cobu.wsc.service.CreateInstanceResponse).register(handleCreateInstanceResponse);
   }

   /**
    *
    */
   this.active = function active() {
      console.log('InstanceNewView active');
   };

   /**
    * @param {cobu.wsc.service.CreateInstanceResponse} response
    */
   function handleCreateInstanceResponse(response) {
      console.log('handleCreateInstanceResponse');

      if (response.success) {
         context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-instance'));
      } else {
         console.log(response);
      }
   }

   /**
    * Handle Create Click
    */
   function handleCreateClick() {
      var data = bind();

      console.log(data);
      var request = new cobu.wsc.service.CreateInstanceRequest();
      $.extend(request, data);

      context.webSocket.send(request);
   }

   /**
    * Bind from form
    * @returns {{}}
    */
   function bind() {

      var data = {};

      $('[data-bind]', parent).each(function() {
         var element = $(this);
         var name = element.attr('data-bind');
         data[name] = element.val();
      });

      return data;
   }

   constructor();
};