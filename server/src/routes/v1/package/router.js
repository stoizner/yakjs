'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const {getStatusRoute} = require('./getStatusRoute');
const {getVersionRoute} = require('./getVersionRoute');

router.get('/status', getStatusRoute);
router.get('/version', getVersionRoute);

module.exports = router;
