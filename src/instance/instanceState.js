'use strict';

/**
 * InstanceState
 * @enum {string}
 */
const InstanceState = {
    STARTING: 'starting',
    STOPPED: 'stopped',
    STARTED: 'started',
    STOPPING: 'stopping',
    ERROR: 'error'
};

module.exports = {InstanceState};
