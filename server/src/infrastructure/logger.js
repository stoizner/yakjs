'use strict';

const {logAdapter} = require('./logAdapter');

module.exports = {
    defaultLogger: logAdapter.getLogger(),
    consoleLogger: logAdapter.getConsoleLogger(),
    pluginLogger: logAdapter.getPluginLogger(),
};
