'use strict';

/**
 * InstanceState
 * @enum {string}
 */
const InstanceState = {
    STARTING: 'starting',
    STOPPED: 'stopped',
    RUNNING: 'running',
    STOPPING: 'stopping',
    ERROR: 'error'
};

module.exports = InstanceState;
