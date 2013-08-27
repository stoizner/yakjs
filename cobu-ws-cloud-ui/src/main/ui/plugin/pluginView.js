/**
 * PluginView
 * @class
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$|jQuery} parent
 */
cobu.wsc.ui.PluginView = function PluginView(parent, context) {
   'use strict';

   /** @type {cobu.wsc.ui.PluginView} */
   var self = this;

   /**
    * @type {null||cobu.wsc.service.PluginInfo}
    */
   var pluginInfo = null;

   /** Constructor */
   function constructor() {
      $('#plugin-save', parent).click(handleSaveClick);

      context.eventBus.on(cobu.wsc.service.CreatePluginResponse).register(handleResponse);
      context.eventBus.on(cobu.wsc.service.UpdatePluginResponse).register(handleResponse);
   }

   /**
    * Activate view
    * @param {string|object} data
    */
   this.active = function active(data) {
      console.log('InstanceView active', data);

      if (data !== null) {
         pluginInfo = data;
      } else {
         pluginInfo = null;
      }

      self.update();
   };

   /**
    *
    */
   this.update = function update() {
      if (pluginInfo === null) {
         $('[data-bind]', parent).val('');
      } else {
         $('[data-bind]', parent).each(function() {
            var element = $(this);
            var name = element.attr('data-bind');
            element.val(pluginInfo[name]);
         });
      }
   };

   /**
    * @param {cobu.wsc.service.CreateInstanceResponse} response
    */
   function handleResponse(response) {
      console.log('handleResponse');

      if (response.success) {
         context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-plugin'));
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

      if (pluginInfo === null) {
         request = new cobu.wsc.service.CreatePluginRequest();
         $.extend(request, data);
      } else {
         request = new cobu.wsc.service.UpdatePluginRequest();
         $.extend(request, data);
         request.pluginName = pluginInfo.name;
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