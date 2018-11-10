'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.get('/blob/', require('./getSpacesRoute'));
router.get('/blob/:space/', require('./getBlobsRoute'));
router.get('/blob/:space/:name', require('./getBlobRoute'));
router.post('/blob/:space/:name', require('./postBlobRoute'));
router.delete('/blob/:space/:name', require('./deleteBlobRoute'));

module.exports = router;
