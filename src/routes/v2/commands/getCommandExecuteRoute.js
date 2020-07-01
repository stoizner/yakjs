'use strict';

const {handleExecuteCommand} = require('./handleExecuteCommand');

module.exports = {
    method: 'get',
    path: '/commands/:commandName/execute',
    handler: handleExecuteCommand,
    schemas: []
};
