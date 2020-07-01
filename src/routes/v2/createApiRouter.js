'use strict';

const express = require('express');
const cors = require('cors');

const {createInstancesRouter} = require('./instances/createInstancesRouter');
const {createCommandsRouter} = require('./commands/createCommandsRouter');

/**
 * @param {Service} service
 */
function createApiRouter(service) {
    const router = express.Router(); // eslint-disable-line new-cap

    router.use(cors());
    router.use(createInstancesRouter(service));
    router.use(createCommandsRouter(service));
    router.use(require('./package/router'));
    router.use(require('./storeItems/router'));
    router.use(require('./blob/router'));
    router.use(require('./config/router'));

    return router;
}

module.exports = {createApiRouter};
