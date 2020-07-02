'use strict';

import express from 'express';
import {getStatusRoute} from './getStatusRoute.js';
import {getVersionRoute} from './getVersionRoute.js';

// eslint-disable-line new-cap
export const router = express.Router();

router.get('/status', getStatusRoute);
router.get('/version', getVersionRoute);


