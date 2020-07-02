'use strict';

import express from 'express';
import getServerConfigRoute from './getServerConfigRoute.js';

export const router = express.Router(); // eslint-disable-line new-cap

router.get('/config', getServerConfigRoute);
