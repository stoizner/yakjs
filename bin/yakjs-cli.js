#!/usr/bin/env node

'use strict';

const path = require('path');
const rootDir = path.join(path.dirname(process.argv[1]), '..');

// Change the process working directory.
process.chdir(rootDir);

require('../server/yakjs.js');
