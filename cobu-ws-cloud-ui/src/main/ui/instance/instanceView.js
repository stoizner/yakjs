/**
 * InstanceView
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$} parent
 */
cobu.wsc.ui.InstanceView = function InstanceView(parent, context)
{
   'use strict';

   /** @type {cobu.wsc.ui.InstanceView} */
   var self = this;

   /**
    * @type {null|cobu.wsc.service.InstanceInfo}
    */
   var instanceInfo = null;

   /** Constructor */
   function constructor() {

      $('#instance-save', parent).click(handleSaveClick);
      context.eventBus.on(cobu.wsc.service.CreateInstanceResponse).register(handleCreateInstanceResponse);
   }

   /**
    * Activate view
    * @param {string} data
    */
   this.active = function active(data) {
      console.log('InstanceView active', data);

      if (data !== null) {
         instanceInfo = data;
      } else {
         instanceInfo = null;
      }

      self.update();
   };

   /**
    * Update form.
    */
   this.update = function update() {
      if (instanceInfo === null) {
         $('[data-bind]', parent).val('');
      } else {
         $('[data-bind]', parent).each(function() {
            var element = $(this);
            var name = element.attr('data-bind');
            element.val(instanceInfo[name]);
         });
      }
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
   function handleSaveClick() {
      var data = bind();

      console.log(data);

      var request = null;

      if (instanceInfo === null) {
         request = new cobu.wsc.service.CreateInstanceRequest();
         $.extend(request, data);
      } else {
         request = new cobu.wsc.service.UpdateInstanceRequest();
         $.extend(request, data);
         request.instanceName = instanceInfo.name;
      }

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