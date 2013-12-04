(function main() {

    'use strict';

    console.log('Start YAK server');

    var configManager = new yak.ConfigManager();
    configManager.load();
    configManager.save();

    var yakServer = new yak.YakServer(configManager);

    var serviceInstance = new yak.ServiceInstance('service', configManager.config.servicePort, yakServer);
    yakServer.start(serviceInstance);

    console.log('YAK server initialized. Running...');
}());




