'use strict';

const request = require('request');

request('http://localhost:8790/instances', (error, response, body) => {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
});
