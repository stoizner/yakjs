'use strict';

const fs = require('fs');
const path = require('path');

/**
 * @class
 */
class HttpsServerOptionsProvider {
    /**
     * @constructor
     * @struct
     */
    constructor() {
        const privateKey = fs.readFileSync(path.join(__dirname, '../../private.key'));
        const certificate = fs.readFileSync(path.join(__dirname, '../../certificate.crt'));

        this.options = {
            key: privateKey,
            cert: certificate
        };
    }
}

module.exports = new HttpsServerOptionsProvider();
