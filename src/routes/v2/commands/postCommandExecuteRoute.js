'use strict';

const {handleExecuteCommand} = require('./handleExecuteCommand');

module.exports = {
    method: 'post',
    path: '/commands/:commandName/execute',
    handler: handleExecuteCommand,
    schemas: []
};
