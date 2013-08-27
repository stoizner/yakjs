/**
 * Codebullets
 * @namespace cobu
 */
var cobu = cobu || {};

/**
 * Web Socket Cloud
 * @namespace cobu
 */
cobu.wsc = cobu.wsc || {};

/**
 * Web Socket Cloud - Service API
 * @namespace cobu
 */
cobu.wsc.service = cobu.wsc.service || {};


/**
 * CreateInstanceRequest
 * @constructor
 */
cobu.wsc.service.CreateInstanceRequest = function CreateInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.createInstance';

   /**
    * Unique name of instance.
    * @type {string}
    */
   this.name = null;

   /**
    * Some description.
    * @type {string}
    */
   this.description = null;

   /**
    *
    * @type {number}
    */
   this.port = 0;

   /**
    * Name of plugins that shall be used by this instance.
    * @type {Array.<string>}
    */
   this.plugins = [];
};/**
 * CreateInstanceResponse
 * @constructor
 */
cobu.wsc.service.CreateInstanceResponse = function CreateInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.createInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * DeleteInstanceRequest
 * @constructor
 */
cobu.wsc.service.DeleteInstanceRequest = function DeleteInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.deleteInstance';

   /**
    * Name of the instance.
    * @type {string}
    */
   this.instanceName = null;
};/**
 * DeleteInstanceResponse
 * @constructor
 */
cobu.wsc.service.DeleteInstanceResponse = function DeleteInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.deleteInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * GetInstancesRequest
 * @constructor
 */
cobu.wsc.service.GetInstancesRequest = function GetInstancesRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.getInstances';
};/**
 * GetInstancesResponse
 * @constructor
 */
cobu.wsc.service.GetInstancesResponse = function GetInstancesResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.getInstances';

   /**
    * List of available cloud instances as InstanceInfo array.
    * @type {Array.<cobu.wsc.service.InstanceInfo>}
    */
   this.instances = [];
};/**
 * InstanceInfo
 * @constructor
 */
cobu.wsc.service.InstanceInfo = function InstanceInfo()
{
   'use strict';

   /**
    *
    * @type {string}
    */
   this.name = null;

   /**
    *
    * @type {string}
    */
   this.state = null;

   /**
    *
    * @type {number}
    */
   this.connectionCount = 0;

   /**
    *
    * @type {number}
    */
   this.port = null;

   /**
    *
    * @type {Array.<string>}
    */
   this.plugins = [];
};/**
 * RemoveInstanceRequest
 * @constructor
 */
cobu.wsc.service.RemoveInstanceRequest = function RemoveInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.removeInstance';

   /**
    * Name of the instance.
    * @type {string}
    */
   this.instanceName = null;
};/**
 * RemoveInstanceResponse
 * @constructor
 */
cobu.wsc.service.RemoveInstanceResponse = function RemoveInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.removeInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * StartInstanceRequest
 * @constructor
 */
cobu.wsc.service.StartInstanceRequest = function StartInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.startInstance';

   /**
    * Name of the instance.
    * @type {string}
    */
   this.instanceName = null;
};/**
 * StartInstanceResponse
 * @constructor
 */
cobu.wsc.service.StartInstanceResponse = function StartInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.startInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * StopInstanceRequest
 * @constructor
 */
cobu.wsc.service.StopInstanceRequest = function StopInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.stopInstance';

   /**
    * Name of the instance.
    * @type {string}
    */
   this.instanceName = null;
};/**
 * StopInstanceResponse
 * @constructor
 */
cobu.wsc.service.StopInstanceResponse = function StopInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.stopInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * UpdateInstanceRequest
 * @constructor
 */
cobu.wsc.service.UpdateInstanceRequest = function UpdateInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.updateInstance';

   /**
    * The original instance name.
    * @type {null}
    */
   this.instanceName = null;

   /**
    * Unique name of instance.
    * @type {string}
    */
   this.name = null;

   /**
    * Some description.
    * @type {string}
    */
   this.description = null;

   /**
    *
    * @type {number}
    */
   this.port = 0;

   /**
    * Name of plugins that shall be used by this instance.
    * @type {Array.<string>}
    */
   this.plugins = [];
};/**
 * UpdateInstanceResponse
 * @constructor
 */
cobu.wsc.service.UpdateInstanceResponse = function UpdateInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.updateInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * GetPluginsRequest
 * @constructor
 */
cobu.wsc.service.GetPluginsRequest = function GetPluginsRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.getPlugins';
};/**
 * GetPluginsResponse
 * @constructor
 */
cobu.wsc.service.GetPluginsResponse = function GetPluginsResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.getPlugins';

   /**
    * List of available cloud Plugins as InstanceInfo array.
    * @type {Array.<cobu.wsc.service.PluginInfo>}
    */
   this.plugins = [];
};/**
 * PluginInfo
 * @constructor
 */
cobu.wsc.service.PluginInfo = function PluginInfo()
{
   'use strict';

   /**
    *
    * @type {string}
    */
   this.name = null;

   /**
    *
    * @type {string}
    */
   this.description = null;

   /**
    *
    * @type {string}
    */
   this.code = null;
};