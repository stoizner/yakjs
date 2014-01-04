/* global yak:true */

/**
 * YAKjs
 * @namespace yak
 */
var yak = yak || {};

/**
 * Web Socket Cloud - Service API
 * @namespace yak
 */
yak.api = yak.api || {};


/**
 * CreateInstanceRequest
 * @constructor
 */
yak.api.CreateInstanceRequest = function CreateInstanceRequest() {

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
yak.api.CreateInstanceResponse = function CreateInstanceResponse() {

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
 * RemoveInstanceRequest
 * @constructor
 */
yak.api.DeleteInstanceRequest = function DeleteInstanceRequest() {

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
yak.api.DeleteInstanceResponse = function DeleteInstanceResponse() {

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
 * GetInstancesRequest
 * @constructor
 */
yak.api.GetInstancesRequest = function GetInstancesRequest() {

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
yak.api.GetInstancesResponse = function GetInstancesResponse() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.getInstances';

    /**
    * List of available cloud instances as InstanceInfo array.
    * @type {Array.<yak.api.InstanceInfo>}
    */
    this.instances = [];
};/**
 * UpdateInstanceRequest
 * @constructor
 */
yak.api.UpdateInstanceRequest = function UpdateInstanceRequest() {

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
yak.api.UpdateInstanceResponse = function UpdateInstanceResponse() {

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
 * InstanceInfo
 * @constructor
 */
yak.api.InstanceInfo = function InstanceInfo() {

    'use strict';

    /**
     * Name of the instance
     * @type {string}
     */
    this.name = null;

    /**
     * Instance state
     * @type {string}
     */
    this.state = null;

    /**
     * Description
     * @type {null|string}
     */
    this.description = null;

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
 * StartInstanceRequest
 * @constructor
 */
yak.api.StartInstanceRequest = function StartInstanceRequest() {

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
yak.api.StartInstanceResponse = function StartInstanceResponse() {

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
yak.api.StopInstanceRequest = function StopInstanceRequest() {

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
yak.api.StopInstanceResponse = function StopInstanceResponse() {

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
 * CreatePluginRequest
 * @constructor
 */
yak.api.CreatePluginRequest = function CreatePluginRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.createPlugin';

    /**
    * Unique name of Plugin.
    * @type {string}
    */
    this.name = null;

    /**
    * Some description.
    * @type {string}
    */
    this.description = null;

    /**
    * Plugin Code.
    * @type {string}
    */
    this.code = null;
};/**
 * CreatePluginResponse
 * @constructor
 */
yak.api.CreatePluginResponse = function CreatePluginResponse() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.createPlugin';

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
 * RemovePluginRequest
 * @constructor
 */
yak.api.DeletePluginRequest = function DeletePluginRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.deletePlugin';

    /**
    * Name of the Plugin.
    * @type {string}
    */
    this.pluginName = null;
};/**
 * RemovePluginResponse
 * @constructor
 */
yak.api.DeletePluginResponse = function DeletePluginResponse() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.deletePlugin';

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
yak.api.GetPluginsRequest = function GetPluginsRequest() {

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
yak.api.GetPluginsResponse = function GetPluginsResponse() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.getPlugins';

    /**
    * List of available cloud Plugins as InstanceInfo array.
    * @type {Array.<yak.api.PluginInfo>}
    */
    this.plugins = [];
};/**
 * UpdatePluginRequest
 * @constructor
 */
yak.api.UpdatePluginRequest = function UpdatePluginRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.updatePlugin';

    /**
    * The original Plugin name.
    * @type {null}
    */
    this.pluginName = null;

    /**
    * Unique name of Plugin.
    * @type {string}
    */
    this.name = null;

    /**
    * Some description.
    * @type {string}
    */
    this.description = null;

    /**
    * The plugin code.
    * @type {string}
    */
    this.code = 0;
};/**
 * UpdatePluginResponse
 * @constructor
 */
yak.api.UpdatePluginResponse = function UpdatePluginResponse() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.updatePlugin';

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
 * PluginInfo
 * @constructor
 */
yak.api.PluginInfo = function PluginInfo() {

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