'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

// Instance actions
router.get('/version', require('./getVersionRoute'));

module.exports = router;
