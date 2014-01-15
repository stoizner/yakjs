var _ = require('underscore');

(function main() {
    'use strict';

    var log = new yak.Logger('STARTUP');

    log.info('Start YAK server');

    var configManager = new yak.ConfigManager();
    configManager.load();
    configManager.save();

    var yakServer = new yak.YakServer(configManager);
    var serviceInstance = new yak.ServiceInstance('service', configManager.config.servicePort, yakServer);

    yakServer.start(serviceInstance);

    log.info('........................................');
    log.info('. YAKjs server initialized and running .');
    log.info('........................................');
}());




