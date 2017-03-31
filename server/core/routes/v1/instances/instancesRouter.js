'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

// Instance
router.get('/instances', require('./getInstancesRoute'));

// Instance actions
router.post('/instances/running/restart', require('./postRestartRunningInstancesRoute'));
router.post('/instances/:instanceId/start', require('./postStartInstancesRoute'));
router.post('/instances/:instanceId/stop', require('./postStopInstancesRoute'));

// Instance configuration
router.post('/instances/config', require('./postInstancesConfigRoute'));
router.put('/instances/:instanceId/config', require('./putInstancesConfigRoute'));
router.delete('/instances/:instanceId/config', require('./deleteInstancesConfigRoute'));

module.exports = router;
