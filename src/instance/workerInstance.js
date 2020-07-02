/* eslint-disable no-empty-function */

/**
 * @interface
 */
export function WorkerInstance() {
    /**
     * The unique instance ID.
     * @type {string}
     */
    this.id = '';

    /**
     * The instance name.
     * @type {null}
     */
    this.name = null;

    /**
     * Start instance.
     */
    this.start = function start() {};

    /**
     * Stop instance.
     * @returns {!Promise}
     */
    this.stop = function stop() {};

    /**
     * Description
     * @type {string}
     */
    this.description = '';

    /**
     * @type {Logger}
     */
    this.log = null;
}
