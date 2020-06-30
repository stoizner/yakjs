'use strict';

const pkg = require('../package.json');

if (pkg.version.includes('SNAPSHOT')) {
    console.error('❌ package.json shall not use a SNAPSHOT version.');
    process.exit(1);
} else {
    console.log('✔ OK');
}
