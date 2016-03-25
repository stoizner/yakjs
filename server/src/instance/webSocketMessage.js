/**
 * WebSocketMessage
 * @constructor
 * @param {Object|string|null} data
 */
yak.WebSocketMessage = function WebSocketMessage(data) {
    /**
     * @type {Object|string|null}
     */
    this.data = data || null;
};
