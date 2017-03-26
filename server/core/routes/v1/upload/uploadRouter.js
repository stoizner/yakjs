'use strict';

const express  = require('express');
const router = express.Router();

// Instance actions
router.post('/upload/file', require('./postUploadFileRoute'));

module.exports = router;
