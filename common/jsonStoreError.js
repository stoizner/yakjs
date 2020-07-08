/**
 * @public
 * @constructor
 * @struct
 * @param {string} message
 * @param {Error|?} originalError
 */
export function JsonStoreError(message, originalError) {
    /**
     * @type {string}
     */
    this.message = message;

    /**
     * @type {Error|?}
     */
    this.originalError = originalError;
}
