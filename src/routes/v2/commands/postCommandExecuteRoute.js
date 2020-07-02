'use strict';

import {handleExecuteCommand} from './handleExecuteCommand.js';

export default {
    method: 'post',
    path: '/commands/:commandName/execute',
    handler: handleExecuteCommand,
    schemas: []
};
