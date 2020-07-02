
/**
 * @constructor
 * @struct
 * @param {Object|string|null} data
 */
export function WebSocketMessage(data) {
    /**
     * @type {Object|string|null}
     */
    this.data = data || null;
}
