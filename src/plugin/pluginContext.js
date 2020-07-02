/**
 * @constructor
 * @struct
 */
export function PluginContext() {
    /**
     * @type {WebSocketInstance}
     */
    this.instance = null;

    /**
     * @type {YakLogger}
     */
    this.log = null;
}
