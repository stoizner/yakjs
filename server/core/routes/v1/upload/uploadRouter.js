'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

// Instance actions
router.post('/upload/file', require('./postUploadFileRoute'));

module.exports = router;
