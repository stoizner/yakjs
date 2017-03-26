'use strict';

const express  = require('express');
const router = express.Router();

router.get('/plugins', require('./getPluginsRoute'));
router.delete('/plugins/:pluginId', require('./deletePluginsRoute'));
router.put('/plugins/:pluginId', require('./putPluginsRoute'));
router.post('/plugins', require('./postPluginsRoute'));

module.exports = router;
