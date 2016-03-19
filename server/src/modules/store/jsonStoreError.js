/**
 * @constructor
 * @param {string} message
 * @param {Error|?} originalError
 */
yak.JsonStoreError = function JsonStore(message, originalError) {
    /**
     * @type {string}
     */
    this.message = message;

    /**
     * @type {Error|?}
     */
    this.originalError = originalError;
};
