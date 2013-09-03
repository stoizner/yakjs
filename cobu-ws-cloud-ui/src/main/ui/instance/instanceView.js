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
      context.eventBus.on(cobu.wsc.service.CreateInstanceResponse).register(handleResponse);
      context.eventBus.on(cobu.wsc.service.UpdateInstanceResponse).register(handleResponse);
   }

   /**
    * Activate view
    * @param {string|object} data
    */
   this.active = function active(data) {
        console.log('InstanceView active', data);

        $('.error-line', parent).hide();

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

            $('[data-bind="pluginsCsv"]', parent).val(instanceInfo.plugins.join(','));
        }
    };

   /**
    * @param {cobu.wsc.service.CreateInstanceResponse} response
    */
   function handleResponse(response) {
        console.log('handleResponse', response);

        var errorLine = $('.error-line', parent);
        if (response.success) {
            context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-instance'));
            errorLine.hide();
        } else {
            errorLine.show();
            $('.error-line-text', errorLine).html(response.message.replace(/\n/g, '<br />'));
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
         request.plugins = data.pluginsCsv.split(',');

      } else {
         request = new cobu.wsc.service.UpdateInstanceRequest();
         $.extend(request, data);
         request.plugins = data.pluginsCsv.split(',');
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