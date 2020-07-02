'use strict';

import {handleExecuteCommand} from './handleExecuteCommand.js';

export default {
    method: 'get',
    path: '/commands/:commandName/execute',
    handler: handleExecuteCommand,
    schemas: []
};
