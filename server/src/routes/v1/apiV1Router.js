'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const cors = require('cors');

router.use(cors());
router.use(require('./commands/router'));
router.use(require('./commands/presets/router'));
router.use(require('./instances/router'));
router.use(require('./logs/router'));
router.use(require('./modules/router'));
router.use(require('./package/router'));
router.use(require('./plugins/router'));
router.use(require('./storeItems/router'));
router.use(require('./upload/router'));
router.use(require('./config/router'));

module.exports = router;
