'use strict';

const post = require('../../post');

const postData = 'Hello World! ƒ(x) = 1';

post('http://localhost:8790/v1/blob/test/test.txt', new Buffer(postData))
    .then(response => {
        console.log(response);
    })
    .catch(console.error);
