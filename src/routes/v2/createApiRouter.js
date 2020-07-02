'use strict';

import cors from 'cors';
import express from 'express';
import {createInstancesRouter} from './instances/createInstancesRouter.js';
import {createCommandsRouter} from './commands/createCommandsRouter.js';

// import storeItems from './storeItems/router';
// import blob from './blob/router';
// import config from './config/router';

/**
 * @param {Service} service
 */
export function createApiRouter(service) {
    const router = express.Router(); // eslint-disable-line new-cap

    router.use(cors());
    router.use(createInstancesRouter(service));
    router.use(createCommandsRouter(service));

    // #TODO
    // router.use(storeItems);
    // router.use(blob);
    // router.use(config);

    return router;
}
