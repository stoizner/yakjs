'use strict';

const express = require('express');

/**
 * @param {Service} service
 */
function createInstancesRouter(service) {
    const router = express.Router(); // eslint-disable-line new-cap

    // Instance
    router.get('/instances', require('./getInstancesRoute'));

    // Instance actions
    router.post('/instances/running/restart', require('./postRestartRunningInstancesRoute'));
    router.post('/instances/:instanceId/start', require('./postStartInstancesRoute'));
    router.post('/instances/:instanceId/stop', require('./postStopInstancesRoute'));

    return router;
}

module.exports = {createInstancesRouter};
