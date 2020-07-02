'use strict';

import pkg from '../package.json';

if (pkg.version.includes('SNAPSHOT')) {
    console.error('❌ package.json shall not use a SNAPSHOT version.');
    process.exit(1);
} else {
    console.log('✔ OK');
}
