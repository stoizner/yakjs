'use strict';

const pkg = require('../package.json');

function checkNonSnapshotVersion() {
    let promise;

    if (pkg.version.includes('SNAPSHOT')) {
        promise = Promise.reject(new Error('package.json shall not use a SNAPSHOT version.'))
    } else {
        promise = Promise.resolve();
    }

    return promise;
}

module.exports = {checkNonSnapshotVersion};
