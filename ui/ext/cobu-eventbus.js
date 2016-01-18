
// cobuEventBus 0.9.0
// Author: Christian Schuller (christian@codebullets.com)
// MIT-License

//noinspection JSHint
/**
 * @namespace cobu
 */
var cobu = {};


/**
 * EventBus
 * @description cobuEventBus is a easy to use, lightweight and flexible JavaScript event bus library.
 * @constructor
 * @author Christian Schuller (christian@codebullets.com)
 */
cobu.EventBus = function EventBus() {

    'use strict';

    /**
     * Preserve instance.
     * @type {cobu.EventBus}
     */
    var self = this;

    /**
     * Dictionary of event bus registrations.
     * @dict
     * @type {Object<String, Array<cobu.Registration>>}
     */
    var registrations = {};

    /**
     * The event bus configuration.
     * @type {cobu.EventBusConfig}
     */
    var config = new cobu.EventBusConfig();

    /**
     * The event bus diagnostics providing event hooks and meta information.
     * @type {cobu.EventBusDiagnostics}
     */
    var diag = new cobu.EventBusDiagnostics();

    /**
     * EventKey builder to create an event key from an event or message.
     * @type {cobu.EventKeyBuilder}
     */
    var eventKeyBuilder = new cobu.EventKeyBuilder(config, diag);

    /**
     * Create a new registration for an event or message.
     * @param {(Object|String|Function)} event the event or message.
     * @returns {cobu.RegistrationSetup} setup object where a callback function can be registered.
     */
    this.on = function on(event) {

        var registration = new cobu.Registration();
        registration.eventKey = eventKeyBuilder.getEventKeyFor(event);

        if (registration.eventKey) {
            add(registration);
        }

        return new cobu.RegistrationSetup(registration, diag);
    };

    /**
     * Post an event or message on the bus.
     * @param {(Object|String|function)} event the event or message.
     * @param {Object|String} [eventData] optional event data. Use it when the event itself can not hold data.
     */
    this.post = function post(event, eventData) {

        var eventKey = eventKeyBuilder.getEventKeyFor(event);
        var eventRegistrations = getRegistrationsFor(eventKey);

        for(var i = 0,len = eventRegistrations.length; i < len; i++) {

            try {
                /** @type {cobu.Registration} */
                var registration = eventRegistrations[i];

                if (registration.eventHandler !== null) {
                    registration.eventHandler(event, eventData);
                }
            } catch (ex) {
                var error = new cobu.EventBusError();
                error.correlatedEventKey = eventKey;
                error.correlatedEvent = event;
                error.message = 'A event registration callback failed.';
                error.originalError = ex;

                diag.handleOnError(error);

                if (config.throwErrorsEnabled) {
                    throw error;
                }
            }
        }

        diag.handleOnPosted(eventKey, event, eventRegistrations);
    };

    /**
     * Post an event or message on the bus in an pseudo asynchronous way.
     * @description Use this way of posting an event, when a lot of
     * registrations doing work that might block the javascript event queue.
     * It uses the windows.setTimeout to split event handler execution.
     * @param {(Object|String|Function)} event the event or message.
     * @param {Object|String} [eventData] optional event data. Use it when the event itself can not hold data.
     */
    this.postAsync = function postAsync(event, eventData) {

        var eventKey = eventKeyBuilder.getEventKeyFor(event);
        var eventRegistrations = getRegistrationsFor(eventKey);

        for(var i = 0, len = eventRegistrations.length; i < len; i++) {
            // This self executing function builds up a closure to get
            // an immutable registration var within the loop.
            //noinspection JSHint
            (function() {
                /** @type {cobu.Registration} */
                var registration = eventRegistrations[i];

                if (registration.eventHandler !== null) {
                    window.setTimeout(function() { registration.eventHandler(event, eventData); }, 0);
                }
            }());
        }
    };

    /**
     * Gets all registrations.
     * @returns {Array<cobu.Registration>}
     */
    this.getRegistrations = function getRegistrations() {

        var allRegistrations = [];

        /** @type {String} */
        var eventKey;

        for(eventKey in registrations) {
            if (registrations.hasOwnProperty(eventKey)) {
                allRegistrations = allRegistrations.concat(registrations[eventKey]);
            }
        }

        return allRegistrations;
    };

    /**
     * Unregister an event handler function.
     * @param {Function} eventCallback the event handler function.
     */
    this.unregister = function unregister(eventCallback) {

        /** @type {Array<cobu.Registration>} */
        var allRegistrations = self.getRegistrations();

        for(var i = 0, len = allRegistrations.length; i < len; i++) {
            if (allRegistrations[i].eventHandler === eventCallback) {
                remove(allRegistrations[i]);
            }
        }
    };

    /**
     * Configure the event bus.
     * @return {cobu.EventBusConfig}
     */
    this.configure = function configure() {
        return config;
    };

    /**
     * EventBus diagnostics.
     * @return {cobu.EventBusDiagnostics}
     */
    this.diagnostics = function diagnostic() {
        return diag;
    };

    /**
     * Get all registrations for an eventKey.
     * @param {String} eventKey the event key (unique for an event or message key).
     * @return {Array<cobu.Registration>} list of registrations for given eventKey.
     */
    function getRegistrationsFor(eventKey) {

        var eventRegistrations = [];

        if (registrations.hasOwnProperty(eventKey)) {
            eventRegistrations =  registrations[eventKey];
        }

        return eventRegistrations;
    }

    /**
     * Add registration to the private dictionary.
     * @param {cobu.Registration} registration
     */
    function add(registration) {

        /** @type {String} */
        var eventKey = registration.eventKey;

        // Ensure that the array of registrations for an evenKey exists.
        if (!registrations.hasOwnProperty(eventKey)) {
            registrations[eventKey] = [];
        }

        registrations[eventKey].push(registration);
    }

    /**
     * Remove registration from the private dictionary.
     * @param {cobu.Registration} registration
     */
    function remove(registration) {

        var registrationsForEvent = registrations[registration.eventKey];
        var index = registrationsForEvent.indexOf(registration);

        registrationsForEvent.splice(index, 1);
    }
};





/**
 * EventBusConfig
 * @constructor
 */
cobu.EventBusConfig = function EventBusConfig() {

    'use strict';

    /**
     * Preserve instance.
     * @type {cobu.EventBusConfig}
     */
    var self = this;

    /**
     * List of build in key reflectors.
     * @type {Array<cobu.KeyReflector>}
     */
    var builtInReflectors = [];

    /**
    * Custom key reflector.
    * @type {Array<cobu.KeyReflector>}
    */
    this.customKeyReflectors = [];

    /**
     * Define whether the build in key reflectors are enabled or not. (default: true)
     * @type {boolean}
     */
    this.buildInKeyReflectorsEnabled = true;

    /**
     * Define whether eventbus throws or suppresses own errors. (default: false)
     * @type {boolean}
     */
    this.throwErrorsEnabled = false;

    /**
     *
     */
    function constructor() {

        builtInReflectors[0] = new cobu.PropertyKeyReflector(cobu.BuildInKeyReflectors.INTERNAL_TYPE, '__type');
        builtInReflectors[1] = new cobu.PropertyKeyReflector(cobu.BuildInKeyReflectors.PROPERTY_TYPE, 'type');
        builtInReflectors[2] = new cobu.MethodKeyReflector(cobu.BuildInKeyReflectors.METHOD_GET_TYPE, 'getType');
        builtInReflectors[3] = new cobu.ConstructorKeyReflector(cobu.BuildInKeyReflectors.CONSTRUCTOR_NAME);
        builtInReflectors[4] = new cobu.ShapeKeyReflector(cobu.BuildInKeyReflectors.OBJECT_SHAPE);

        builtInReflectors.sort(prioritySorter);
    }

    /**
     * Get all built in key reflectors.
     * @returns {Array<cobu.KeyReflector>}
     */
    this.getBuiltInKeyReflectors = function getBuiltInKeyReflectors() {
        return builtInReflectors;
    };

    /**
    * Set a custom key reflector.
    * @param {cobu.KeyReflector} reflector
    * @return {cobu.EventBusConfig}
    */
    this.addCustomKeyReflector = function addCustomKeyReflector(reflector) {
        self.customKeyReflectors.push(reflector);
        return self;
    };

    /**
     * Removes all custom key reflectors.
     * @returns {cobu.EventBusConfig}
     */
    this.removeAllCustomKeyReflectors = function removeAllCustomKeyReflectors() {
        self.customKeyReflectors = [];
        return self;
    };

    /**
     * Enables all build in key reflectors. (default: true)
     * Be aware that if no custom key reflector is added no
     * registered event handler can be called.
     * @param {boolean} enabled whether build in key reflectors shall be used or not
     * @return {cobu.EventBusConfig}
     */
    this.buildInKeyReflectorsEnabled = function buildInKeyReflectorsEnabled(enabled) {
        self.buildInKeyReflectorsEnabled = enabled;
        return self;
    };

    /**
     * Define whether eventbus throws or suppresses own errors.
     * @param {boolean} [enabled] whether eventbus throws or suppresses own errors
     * @return {cobu.EventBusConfig}
     */
    this.enableThrowError = function enableThrowError(enabled) {
        self.throwErrorsEnabled = (typeof enabled === 'undefined') ? true : enabled;
        return self;
    };

    /**
     *
     * @param {cobu.BuildInKeyReflectors} builtInReflector
     * @param {cobu.KeyReflectorPriority} priority
     */
    this.setBuildInKeyReflectorPriority = function setBuildInKeyReflectorPriority(builtInReflector, priority) {

        var index = indexOfBuiltInKeyReflector(builtInReflector);

        if (index > 0) {

            var prioArray = [];
            var reflector = builtInReflectors[index];

            if (priority === cobu.KeyReflectorPriority.HIGH) {
                builtInReflectors.splice(index, 1);
                prioArray.push(reflector);
                prioArray = prioArray.concat(builtInReflectors);
            } else if (priority === cobu.KeyReflectorPriority.LOW) {
                builtInReflectors.splice(index, 1);
                prioArray = prioArray.concat(builtInReflectors);
                prioArray.push(reflector);
            } else {
                prioArray = prioArray.concat(builtInReflectors);
            }

            builtInReflectors = prioArray;
        }

        return self;
    };

    /**
     *
     * @param {cobu.BuildInKeyReflectors} builtInKeyReflector
     * @returns {number}
     */
    function indexOfBuiltInKeyReflector(builtInKeyReflector) {
        var index = -1;

        for(var i = 0, len = builtInReflectors.length; i < len; i++) {
            if (builtInReflectors[i].getName() === builtInKeyReflector) {
                index = i;
            }
        }

        return index;
    }

    /**
     * Priority sorter
     * @param {{prio:number}} objA
     * @param {{prio:number}} objB
     */
    function prioritySorter(objA, objB) {

        var result = 0;

        if (objA.prio < objB.prio) { result = -1; }
        if (objA.prio > objB.prio) { result = 1; }

        return result;
    }

    constructor();
};
/**
 * EventBusDiagnostics
 * @description provide events and information about the event bus itself.
 * @constructor
 */
cobu.EventBusDiagnostics = function EventBusDiagnostics() {

    'use strict';

    /**
     * Preserve instance.
     * @type {cobu.EventBusDiagnostics}
     */
    var self = this;

    /** @type {function(string, *, Array<cobu.Registration>)} */
    var onPostedCallback = null;

    /** @type {function(string, cobu.Registration)} */
    var onRegisteredCallback = null;

    /** @type {function(cobu.EventBusError)} */
    var onErrorCallback = null;

    /**
     * Constructor.
     */
    function constructor() {
    }

    /**
     * Callback is called when an eventbus error occurs.
     * @param {function(string, *, Array<cobu.Registration>)|null} callback
     * @returns {cobu.EventBusDiagnostics}
     */
    this.onError = function onError(callback) {

        onErrorCallback = callback;
        return self;
    };

    /**
     * @param {cobu.EventBusError} error
     * @protected
     */
    this.handleOnError = function handleOnError(error) {

        if (onErrorCallback) {
            onErrorCallback(error);
        }
    };

    /**
     * Callback is called on every eventBus.post.
     * @param {function(string, *, Array<cobu.Registration>)|null} callback
     * @returns {cobu.EventBusDiagnostics}
     */
    this.onPosted = function onPosted(callback) {

        onPostedCallback = callback;
        return self;
    };

    /**
     * @param {Object|string} eventKey
     * @param {*} event
     * @param {Array<cobu.Registration>} registrations
     * @protected
     */
    this.handleOnPosted = function handleOnPosted(eventKey, event, registrations) {

        if (onPostedCallback) {
            onPostedCallback(eventKey, event, registrations);
        }
    };

    /**
     * Callback is called on every new registration.
     * @param {function(string, *, Array<cobu.Registration>)|null} callback
     * @returns {cobu.EventBusDiagnostics}
     */
    this.onRegistered = function onRegistered(callback) {

        onRegisteredCallback = callback;
        return self;
    };

    /**
     * @param {Object|string} eventKey
     * @param {cobu.Registration} registration
     * @protected
     */
    this.handleOnRegistered = function handleOnRegistered(eventKey, registration) {

        if (onRegisteredCallback) {
            onRegisteredCallback(eventKey, registration);
        }
    };

    constructor();
};
/**
 * EventBusError
 * @constructor
 * @param {string} message
 */
cobu.EventBusError = function EventBusError(message) {

    'use strict';

    /**
     * The error message.
     * @type {string}
     */
    this.message = message || '';

    /**
     * Can contain the event key that correlates to this error.
     * @type {string}
     */
    this.correlatedEventKey = null;

    /**
     * Can contain the event that correlates to this error.
     * @type {*|null}
     */
    this.correlatedEvent = null;

    /**
     * Can contain the original error object.
     * @type {object|null}
     */
    this.originalError = null;
};
/**
 * The eventKey builder. It tries to create an event key for any event or command.
 * For 'string' events the string itself is used as the key. For 'object' events,
 * type reflectors (@see {KeyReflector}) are used to get a type information.
 * @inner
 * @constructor
 * @param {cobu.EventBusConfig} config the event bus configuration.
 * @param {cobu.EventBusDiagnostics} diag
 */
cobu.EventKeyBuilder = function EventKeyBuilder(config, diag) {

    'use strict';

    //noinspection LocalVariableNamingConventionJS
    /**
     * Separator character for key-key and event-key.
     * @type {String}
     * @const
     */
    var REFLECTOR_KEY_SEPARATOR = '_';

    /**
     * The key reflection scanner uses different key reflectors to get information out of an object
     * that can be used as a unique key. Therefore several build in reflectors are available.
     * Custom reflectors can be added via configuration and have to implement the @see {KeyReflector} interface.
     * @type {cobu.KeyReflectorScanner}
     */
    var keyReflectorScanner = new cobu.KeyReflectorScanner(config);

    /**
     * Get the unique event key for a given event.
     * @param {(Object|String|Function)} event
     */
    this.getEventKeyFor = function getEventKeyFor(event) {

        var eventArg = event;
        var eventType = typeof(eventArg);
        var eventKey = null;

        // When a function is specified, then assume a factory pattern and call the function.
        if (eventType === 'string') {
            eventKey = buildEventKey(cobu.EventKeyPrefix.string, eventArg);
        } else if (eventType === 'object') {
            eventKey = getEventKeyOf(eventArg);
        } else if (eventType === 'function') {
            eventArg = new eventArg();
            eventKey = getEventKeyOf(eventArg);
        }

        if (eventKey === null) {

            var error = new cobu.EventBusError();
            error.correlatedEvent = event;
            error.message = 'Invalid event object. Type could not be detected. (EventKey could not be created. Please check event or key reflectors.)';

            diag.handleOnError(error);

            if (config.throwErrorsEnabled) {
                throw error;
            }
        }

        return eventKey;
    };

    /**
     * Build a unique event key out of the event key key and the event key.
     * @param {String} eventKeyPrefix
     * @param {String} eventKey the name of event key
     * @returns {string} the unique event key
     */
    function buildEventKey(eventKeyPrefix, eventKey) {
        return eventKeyPrefix + REFLECTOR_KEY_SEPARATOR + eventKey;
    }

    /**
     * Get the object key to be used for the event key.
     * @param {Object} obj any event or message object.
     */
    function getEventKeyOf(obj) {

        /** @type {cobu.KeyInfo} */
        var keyInfo = keyReflectorScanner.getKeyOf(obj);
        var eventKey = null;

        if (keyInfo !== null) {
            eventKey = buildEventKey(keyInfo.reflector, keyInfo.key);
        }

        return eventKey;
    }
};
/**
 * Event key type enum.
 * @inner
 * @readonly
 * @enum {String}
 */
cobu.EventKeyPrefix = {

    /**
     * A string is used as the event key.
     * @const
     */
    string : 'string',

    /**
     * The event/message key is used as the event key.
     * @const
     */
    reflection : 'reflection'
};
/**
 * Function.name shim for all browsers that do not support it.
 */
(function functionNameShim() {

    'use strict';

    if ((Function.prototype.name === 'undefined') &&
        (Object.defineProperty !== 'undefined')) {
        Object.defineProperty(Function.prototype, 'name', {
            get: function() {
                var regex = /function\s([^(]{1,})\(/;
                var result = regex.exec(this.toString());
                return (result && result.length > 1) ? result[1].trim() : 'Object';
            },
            set: function(value) {}
        });
    }
}());
/**
 * BuildInTypeReflector enum.
 * @readonly
 * @enum {String}
 */
cobu.BuildInKeyReflectors = {

    /**
     * Type reflection via property '__type'.
     * @const
     */
    INTERNAL_TYPE: 'it',

    /**
     * Type reflection via property 'key'.
     * @const
     */
    PROPERTY_TYPE: 'pt',

    /**
     * Type reflection via property '__type'.
     * @const
     */
    METHOD_GET_TYPE: 'mgt',

    /**
     * Type reflection via constructor name. Does not work on event objects without constructor.
     * @const
     */
    CONSTRUCTOR_NAME: 'ctor',

    /**
     * Type reflection via object shape (sum of all properties).
     * @const
     */
    OBJECT_SHAPE: 'shp'
};
/**
 * ConstructorKeyReflector
 * @description Uses the constructor name of an event function as key.
 * @constructor
 * @implements {cobu.KeyReflector}
 * @param {String} reflectorName Name of the reflector.
 */
cobu.ConstructorKeyReflector = function ConstructorKeyReflector(reflectorName) {

    'use strict';

    /**
     * Get the reflector name.
     * @return {String} name of the key reflector.
     */
    this.getName = function getName() {
        return reflectorName;
    };

    /**
     * Get key from object from the constructor name.
     * @param {Object} obj any event or message object.
     * @returns {string} the unique event key
     */
    this.getKey = function getKey(obj) {

        /** @type {String} */
        var type = null;

        if (obj.constructor) {
            type = obj.constructor.name;

            // If it is a object without constructor, some
            // JS Engines will return 'Object'. But this information is not
            // enough as a key description.
            if (type === 'Object') {
                type = null;
            }
        }

        return type;
    };
};



/**
 * KeyInfo
 * @constructor
 * @struct
 * @param {String} reflector the name of the reflector that created the key.
 * @param {String} key the event key.
 */
cobu.KeyInfo = function KeyInfo(reflector, key) {

    'use strict';

    /**
    * The key of the object.
    * @type {String}
    */
    this.key = key;

    /**
    * The name of the reflector used to get the key information.
    * @description A reflector describes how the key information was extracted.
    * @type {String}
    */
    this.reflector = reflector;
};
/**
 * The KeyReflector interface.
 * @description Custom key reflectors have to implement this interface.
 * @public
 * @interface
 */
cobu.KeyReflector = function KeyReflector() {};

/**
 * Get the name of the key reflector.
 * @return {String} name of the key reflector.
 */
cobu.KeyReflector.getName = function() {

    'use strict';
    return null;
};

/**
 * Get the key of an object.
 * @param {Object} obj the event object.
 * @return {String|null} the key for the given object.
 */
cobu.KeyReflector.getKey = function(obj) {

    'use strict';
    return null;
};
/**
 * KeyReflectorPriority enum.
 * @readonly
 * @enum {String}
 */
cobu.KeyReflectorPriority = {

    /**
     * LOW priority.
     */
    LOW: 'low',

    /**
     * MEDIUM (default) priority.
     * @const
     */
    MEDIUM: 'medium',

    /**
     * HIGH priority.
     * @const
     */
    HIGH: 'high'
};
/**
 * KeyReflectorScanner
 * @description Create an unique key for an event via built-in and/or custom key reflectors.
 * @inner
 * @constructor
 * @param {cobu.EventBusConfig} config
 */
cobu.KeyReflectorScanner = function KeyReflectorScanner(config) {

    'use strict';

    /**
     * Constructor
     */
    function constructor() {
    }

    /**
     * Get key of event object via key reflectors.
     * @param {Object} obj the object event.
     * @returns {cobu.KeyInfo} the keyInfo of the object event.
     */
    this.getKeyOf = function getKeyOf(obj) {

        /** @type {cobu.KeyInfo} */
        var typeInfo = null;

        /** @type {Array<cobu.KeyReflector>} */
        var builtInReflectors = config.getBuiltInKeyReflectors();

        if (config.customKeyReflectors.length > 0) {
            typeInfo = reflectTypeInfoWith(config.customKeyReflectors, obj);
        }

        if (typeInfo === null && config.buildInKeyReflectorsEnabled) {
            typeInfo = reflectTypeInfoWith(builtInReflectors, obj);
        }

        return typeInfo;
    };

    /**
     * Try to reflect the KeyInfo for the object from a list of reflectors.
     * @param {Array<cobu.KeyReflector>} reflectors
     * @param {Object} obj
     */
    function reflectTypeInfoWith(reflectors, obj) {

        /** @type {cobu.KeyInfo} */
        var keyInfo = null;

        // Find the key via build in reflectors. The first valid result will be used as key discriminator.
        for (var i = 0, len = reflectors.length; i < len; i++) {
            /** @type {cobu.KeyReflector} */
            var reflector = reflectors[i];

            var key = reflector.getKey(obj);

            if (key !== null) {
                keyInfo = new cobu.KeyInfo(reflector.getName(), key);
                break;
            }
        }

        return keyInfo;
    }

    constructor();
};
/**
 * MethodKeyReflector
 * @description Uses a given methodName to get the key.
 * @constructor
 * @implements {cobu.KeyReflector}
 * @param {String} reflectorName name of the reflector.
 * @param {String} methodName name of the method to execute to get the key.
 */
cobu.MethodKeyReflector = function MethodKeyReflector(reflectorName, methodName) {

    'use strict';

    /**
    * Get reflector name.
    * @return {String} name of the key reflector.
    */
    this.getName = function getName() {
        return reflectorName;
    };

    /**
    * Get key from object via a key method.
    * @param {Object} obj the event object.
    * @returns {string} the unique event key.
    */
    this.getKey = function getKey(obj) {

        /** @type {String} */
        var type = null;

        if (obj[methodName]) {
            var method = obj[methodName];

            if (typeof(method) === 'function') {
                type = method();
            }
        }

        return type;
    };
};





/**
 * PropertyKeyReflector
 * @description Uses a given propertyName to get the key.
 * @constructor
 * @implements {cobu.KeyReflector}
 * @param {String} propertyName the name of the property.
 * @param {String} reflectorName the name of the reflector.
 */
cobu.PropertyKeyReflector = function PropertyKeyReflector(reflectorName, propertyName) {

    'use strict';

    /**
     * Get the reflector name.
     * @return {String} name of the key reflector.
     */
    this.getName = function getName() {
        return reflectorName;
    };

    /**
     * Get key from object via key property.
     * @param {Object} obj the event object.
     * @returns {string} the unique event key.
     */
    this.getKey = function getKey(obj) {

        /** @type {String} */
        var type = null;

        if (obj[propertyName]) {
            type = obj[propertyName];
        }

        return type;
    };
};



/**
 * ShapeKeyReflector
 * @description Uses every property names to build up the event key.
 * @inner
 * @constructor
 * @implements {cobu.KeyReflector}
 * @param {String} reflectorName the reflector name.
 */
cobu.ShapeKeyReflector = function ShapeKeyReflector(reflectorName) {

    'use strict';

    /**
    * @return {String} name of the key reflector.
    */
    this.getName = function getName() {
        return reflectorName;
    };

    /**
    * Get key from object defined by all of its properties.
    * @param {Object} obj any event or message object.
    * @returns {string} the unique event key
    */
    this.getKey = function getKey(obj) {

        /**
        * @type {String}
        */
        var type = '';
        var isFirst = true;

        // In this scenario we really want every property of the object.
        //noinspection JSHint
        for(var key in obj) {
            if (isFirst) {
                isFirst = false;
            } else {
                type += '_';
            }

            type += key;
        }

        if (type === '') {
            type = null;
        }

        return type;
    };
};


/**
 * EventBus registration
 * @constructor
 */
cobu.Registration = function Registration() {

    'use strict';

    /**
    * The registration is assigned to an event with a key.
    * @type {String}
    */
    this.eventKey = null;

    /**
    * When an event with @code{eventKey} was posted, the handle function will be called.
    * @type {Function(object)}
    */
    this.eventHandler = null;
};
/**
 * EventBus RegistrationSetup
 * @constructor
 * @param {cobu.Registration} registration
 * @param {cobu.EventBusDiagnostics} diagnostic
 */
cobu.RegistrationSetup = function RegistrationSetup(registration, diagnostic) {

    'use strict';

    /**
    * Register a event or message handler callback function.
    * @param {Function} eventCallback the callback function.
    */
    this.register = function register(eventCallback) {
        registration.eventHandler = eventCallback;

        diagnostic.handleOnRegistered(registration.eventKey, registration);
    };
};
