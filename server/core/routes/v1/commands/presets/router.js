'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.get('/commands/presets', require('./getCommandPresetsRoute'));
router.post('/commands/presets', require('./postCommandPresetsRoute'));
router.put('/commands/presets/:presetName', require('./putCommandPresetsRoute'));
router.delete('/commands/presets/:presetName', require('./deleteCommandPresetsRoute'));

router.post('/commands/presets/:presetName/execute', require('./executeCommandPreset'));
router.get('/commands/presets/:presetName/execute', require('./executeCommandPreset'));

module.exports = router;
