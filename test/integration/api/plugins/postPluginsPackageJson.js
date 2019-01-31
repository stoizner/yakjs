'use strict';

const post = require('../../httpPost');

const packageJson = {
    name: 'plugin-dependencies',
    version: '1.0.0',
    dependencies: {
        uuid: '^3.3.2'
    }
};

post('http://localhost:8790/v1/plugins/package-json', JSON.stringify(packageJson), 'application/json')
    .then(response => {
        console.log(response);
    })
    .catch(console.error);
