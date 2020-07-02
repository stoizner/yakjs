'use strict';

import fse from 'fs-extra';
import httpPost from '../../httpPost';
import mime from 'mime-types';

const fileName = '../../../../ui/src/favicon-32x32.png';
const contentType = mime.lookup(fileName);
console.log(contentType);

fse.readFile(fileName)
    .then(content => httpPost('http://localhost:8790/v1/blob/test/favicon.png', content, contentType))
    .then(response => {
        console.log(response);
    })
    .catch(console.error);

