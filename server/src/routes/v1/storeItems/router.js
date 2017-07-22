'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.get('/storeitems/keys', require('./getStoreItemKeysRoute'));
router.get('/storeitems/:key', require('./getStoreItemsRoute'));
router.get('/storeitems/:key/value', require('./getStoreItemsValueRoute'));

router.delete('/storeitems/:key', require('./deleteStoreItemsRoute'));
router.put('/storeitems/:key', require('./putStoreItemsRoute'));
router.put('/storeitems/:key/value', require('./putStoreItemsValueRoute'));
router.post('/storeitems', require('./postStoreItemsRoute'));

module.exports = router;
