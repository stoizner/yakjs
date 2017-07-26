'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.get('/logs/plugins/:pluginId', require('./getPluginLogsRoute'));
router.get('/logs/yakjs', require('./getYakjsLogsRoute'));

module.exports = router;
