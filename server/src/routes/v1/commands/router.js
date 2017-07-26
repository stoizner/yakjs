'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.post('/commands/:commandName/execute', require('./executeCommand'));
router.get('/commands/:commandName/execute', require('./executeCommand'));
router.get('/commands', require('./getCommandsRoute'));

module.exports = router;
