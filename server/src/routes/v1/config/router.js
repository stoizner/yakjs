'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.get('/config', require('./getServerConfigRoute'));
router.put('/config', require('./putServerConfigRoute'));

module.exports = router;
