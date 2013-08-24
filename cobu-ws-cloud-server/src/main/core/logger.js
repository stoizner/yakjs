/**
 * Logger
 * @class
 * @constructor
 * @param {string} [name]
 */
cobu.wsc.Logger = function Logger(name)
{
   'use strict';

   /** @type {cobu.wsc.Logger} */
   var self = this;

   var prefix = name || '';

   /** Constructor */
   function constructor()
   {
   }

   /**
    * @param {string} message
    */
   this.info = function info(message) {
      var msg = prefix + ' INFO  ' + message;
      console.log(msg.trim());
   };

   /**
    * @param {string} message
    */
   this.warn = function warn(message) {
      var msg = prefix + ' WARN  ' + message;
      console.warn(msg.trim());
   };

   /**
    * @param {string} message
    */
   this.error = function error(message) {
      var msg = prefix + ' ERROR ' + message;
      console.warn(msg.trim());
   };

   constructor();
};