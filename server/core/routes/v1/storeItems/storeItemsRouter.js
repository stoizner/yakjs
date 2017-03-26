'use strict';

const express  = require('express');
const router = express.Router();

router.get('/storeitems/keys', require('./getStoreItemKeysRoute'));
router.get('/storeitems/:key', require('./getStoreItemsRoute'));
router.delete('/storeitems/:key', require('./deleteStoreItemsRoute'));
router.put('/storeitems/:key', require('./putStoreItemsRoute'));
router.post('/storeitems', require('./postStoreItemsRoute'));

module.exports = router;
