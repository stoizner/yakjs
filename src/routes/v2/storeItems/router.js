'use strict';

import express from 'express';

import getStoreItemKeysRoute from './getStoreItemKeysRoute.js';
import getStoreItemsRoute from './getStoreItemsRoute.js';
import getStoreItemsValueRoute from './getStoreItemsValueRoute.js';
import deleteStoreItemsRoute from './deleteStoreItemsRoute.js';
import putStoreItemsRoute from './putStoreItemsRoute.js';
import putStoreItemsValueRoute from './putStoreItemsValueRoute.js';
import postStoreItemsRoute from './postStoreItemsRoute.js';

export const router = express.Router(); // eslint-disable-line new-cap

router.get('/storeitems/keys', getStoreItemKeysRoute);
router.get('/storeitems/:key', getStoreItemsRoute);
router.get('/storeitems/:key/value', getStoreItemsValueRoute);

router.delete('/storeitems/:key', deleteStoreItemsRoute);
router.put('/storeitems/:key', putStoreItemsRoute);
router.put('/storeitems/:key/value', putStoreItemsValueRoute);
router.post('/storeitems', postStoreItemsRoute);
