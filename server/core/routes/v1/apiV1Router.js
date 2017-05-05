'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.use(require('./instances/instancesRouter'));
router.use(require('./plugins/pluginsRouter'));
router.use(require('./storeItems/storeItemsRouter'));
router.use(require('./modules/modulesRouter'));
router.use(require('./upload/uploadRouter'));
router.use(require('./package/router'));

module.exports = router;
