'use strict';

/**
 * @class
 */
export class InstanceStartedEvent {
    /**
     * @param {!core.Express} app
     */
    constructor(app) {
        /**
         * @type {!core.Express}
         */
        this.app = app;
    }
}
