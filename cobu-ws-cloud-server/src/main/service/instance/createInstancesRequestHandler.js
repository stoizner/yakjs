/**
 * CreateInstanceRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.CreateInstanceRequestHandler = function CreateInstanceRequestHandler(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.CreateInstanceRequestHandler} */
   var self = this;

   /** Constructor */
   function constructor()
   {
   }

   /**
    * @param {cobu.wsc.service.CreateInstanceRequest} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {

         var isNameAlreadyUsed = checkInstanceName(message.name);

         if (isNameAlreadyUsed) {
            var response = new cobu.wsc.service.CreateInstanceResponse();
            response.success = false;
            response.message = 'Cannot create instance: Name is already used.';
            connection.send(response);
         } else {
            var newInstance = new cobu.wsc.WebSocketInstance(message.name, message.port, cloudServer);
            newInstance.description = message.description;

            cloudServer.addInstance(newInstance);
            connection.send(new cobu.wsc.service.CreateInstanceResponse());
         }
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   /**
    * Check if instance name is already in use.
    * @param {string} name
    */
   function checkInstanceName(name) {

      var isNameAlreadyUsed = false;
      var instances = cloudServer.getInstances();

      for(var i=0; i<instances.length; i++) {
         if (instances[i].name.trim() === name.trim()) {
            isNameAlreadyUsed = true;
            break;
         }
      }

      return isNameAlreadyUsed;
   }

   constructor();
};