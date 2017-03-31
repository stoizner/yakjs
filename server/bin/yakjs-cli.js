#!/usr/bin/env node

'use strict';

const path = require('path');
let yakjsModuleDir = path.join(path.dirname(process.argv[1]), '..');

// Change the process working directory.
process.chdir(yakjsModuleDir);

require('../yakjs.js');
