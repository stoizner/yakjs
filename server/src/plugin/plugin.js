/**
 * Plugin
 * @constructor
 */
yak.Plugin = function Plugin() {
    /**
     * The plugin id.
     * @type {?string}
     */
    this.id = null;

    /**
     * Description of the plugin.
     * @type {?string}
     */
    this.description = null;

    /**
     * The version of the plugin. Use semantic versioning. (e.g.: 0.1.0)
     * @type {?string}
     */
    this.version = null;

    /**
     * The plugin type.
     * @type {string}
     */
    this.type = 'WebSocketServerPlugin';

    /**
     * The doctrine parsed JsDoc content.
     * @type {Object}
     */
    this.jsDoc = null;

    /**
     * @type {?string}
     */
    this.code = null;

    /**
     * Constructor to create a plugin instance.
     * @type {null|Function}
     * @implements {yak.PluginWorker}
     */
    this.PluginConstructor = null;
};
