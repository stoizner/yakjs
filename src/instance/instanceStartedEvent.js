'use strict';

/**
 * @class
 */
class InstanceStartedEvent {
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

module.exports = {InstanceStartedEvent};
