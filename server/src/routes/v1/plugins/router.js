'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.get('/plugins', require('./getPluginsRoute'));
router.delete('/plugins/:pluginId', require('./deletePluginsRoute'));
router.put('/plugins/:pluginId', require('./putPluginsRoute'));
router.post('/plugins', require('./postPluginsRoute'));

router.post('/plugins/package-json', require('./postPluginsPackageJsonRoute'));

module.exports = router;
