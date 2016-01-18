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


(function() {
    'use strict';

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    /**
     * Create a GUID.
     * @returns {string} The GUID
     */
    yak.api.guid = function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
}());/**
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
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

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
     * @type {Array<string>}
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
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

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
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
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
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
    * List of available cloud instances as InstanceInfo array.
    * @type {Array<yak.api.InstanceInfo>}
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
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

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
    * @type {Array<string>}
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
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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
     * Number of current active connections
     * @type {number}
     */
    this.connectionCount = 0;

    /**
     * Number of total Assigned plugins
     * @type {number}
     */
    this.pluginTotalCount = 0;

    /**
     * Number of active plugins
     * @type {number}
     */
    this.pluginActiveCount = 0;

    /**
    *
    * @type {number}
    */
    this.port = null;

    /**
    *
    * @type {Array<string>}
    */
    this.plugins = [];
};/**
 * RestartInstanceRequest
 * @constructor
 */
yak.api.RestartInstanceRequest = function RestartInstanceRequest() {

    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.restartInstance';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
     * Name of the instance.
     * @type {string}
     */
    this.instanceName = null;
};/**
 * RestartInstanceResponse
 * @constructor
 */
yak.api.RestartInstanceResponse = function RestartInstanceResponse() {

    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.restartInstance';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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
yak.api.StartInstanceRequest = function StartInstanceRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.startInstance';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

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
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

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
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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
 * Get server log information
 * @constructor
 */
yak.api.GetLogInfoRequest = function GetLogInfoRequest() {

    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.getLogInfo';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
     * Filter for a specific instance.
     * @type {?string}
     */
    this.filterInstanceName = null;

    /**
     * Maximal count of log results
     * @type {number}
     */
    this.maxCount = 500;
};/**
 * GetLogInfoResponse
 * @constructor
 */
yak.api.GetLogInfoResponse = function GetLogInfoResponse() {

    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getLogInfo';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
     * List of log information.
     * @type {Array<yak.api.LogInfo>}
     */
    this.logs = [];
};/**
 * LogInfo
 * @constructor
 */
yak.api.LogInfo = function LogInfo() {

    'use strict';

    /**
     * Log Level (info|warn|error|debug)
     * @type {string}
     */
    this.level = null;

    /**
     * category name.
     * @type {?string}
     */
    this.category = null;

    /**
     * Log information.
     * @type {?string}
     */
    this.info = null;

    /**
     * ISO DateTime format when the log entry was created.
     * @type {?string}
     */
    this.time = null;
};/**
 * CreateOrUpdatePluginRequest
 * @constructor
 */
yak.api.CreateOrUpdatePluginRequest = function CreateOrUpdatePluginRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.createOrUpdatePlugin';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

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
 * CreateOrUpdatePluginResponse
 * @constructor
 */
yak.api.CreateOrUpdatePluginResponse = function CreateOrUpdatePluginResponse() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.createOrUpdatePlugin';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

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
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

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
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
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
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
    * List of available cloud Plugins as InstanceInfo array.
    * @type {Array<yak.api.PluginInfo>}
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
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

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
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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
};/**
 * DeleteStoreItemRequest
 * @constructor
 */
yak.api.DeleteStoreItemRequest = function DeleteStoreItemRequest(key) {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.deleteStoreItem';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
     * Store key
     * @type {string}
     */
    this.key = key;
};/**
 * DeleteStoreItemResponse
 * @constructor
 */
yak.api.DeleteStoreItemResponse = function DeleteStoreItemResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.deleteStoreItem';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
     * Was setting store value successful.
     * @type {boolean}
     */
    this.success = true;
};/**
 * GetStoreKeyInfoRequest
 * @constructor
 */
yak.api.GetStoreKeyInfoRequest = function GetStoreKeyInfoRequest() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.getStoreKeyInfo';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
};/**
 * GetStoreKeyInfoResponse
 * @constructor
 */
yak.api.GetStoreKeyInfoResponse = function GetStoreKeyInfoResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getStoreKeyInfo';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
     * List of log information.
     * @type {Array<yak.api.StoreKeyInfo>}
     */
    this.keys = [];
};/**
 * GetStoreValueRequest
 * @constructor
 */
yak.api.GetStoreValueRequest = function GetStoreValueRequest() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.getStoreValue';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
     * Store key
     * @type {?string}
     */
    this.key = null;
};/**
 * GetStoreValueResponse
 * @constructor
 */
yak.api.GetStoreValueResponse = function GetStoreValueResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getStoreValue';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
     * The store key.
     * @type {?string}
     */
    this.key = null;

    /**
     * The key-value pair description.
     * @type {null}
     */
    this.description = null;

    /**
     * The store value.
     * @type {?string}
     */
    this.value = null;
};/**
 * SetStoreValueRequest
 * @constructor
 */
yak.api.SetStoreValueRequest = function SetStoreValueRequest() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.setStoreValue';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
     * The store key.
     * @type {?string}
     */
    this.key = null;

    /**
     * The key-value pair description.
     * @type {null}
     */
    this.description = null;

    /**
     * The store value.
     * @type {?string}
     */
    this.value = null;
};/**
 * SetStoreValueResponse
 * @constructor
 */
yak.api.SetStoreValueResponse = function SetStoreValueResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.setStoreValue';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
     * Was setting store value successful.
     * @type {boolean}
     */
    this.success = true;
};/**
 * StoreKeyInfo
 * @constructor
 */
yak.api.StoreKeyInfo = function StoreKeyInfo() {
    'use strict';

    /**
     * The store key.
     * @type {string}
     */
    this.key = null;

    /**
     * The store description for that key.
     * @type {?string}
     */
    this.description = null;
};
