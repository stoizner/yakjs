'use strict';

const express  = require('express');
const router = express.Router();

router.get('/modules/names', require('./getModuleNamesRoute'));
router.get('/modules/:moduleName', require('./getModuleRoute'));
router.delete('/modules/:moduleName', require('./deleteModulesRoute'));
router.put('/modules/:moduleName', require('./putModulesRoute'));
router.post('/modules', require('./postModulesRoute'));

router.post('/modules/cache/clear', require('./postClearModulesCacheRoute'));

module.exports = router;
