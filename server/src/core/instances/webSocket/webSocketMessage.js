/**
 * WebSocketMessage
 * @constructor
 * @param {string} data
 */
yak.WebSocketMessage = function WebSocketMessage(data) {
    /**
     * @type {string|null}
     */
    this.data = data || null;
};
