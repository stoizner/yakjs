/**
 * @constructor
 * @param {yak.YakServer} yakServer
 */
yak.RestartAllRunningInstancesRequestHandler = function RestartAllRunningInstancesRequestHandler(yakServer) {
    'use strict';

    var log = yak.log.getLogger('yak.RestartAllRunningInstancesRequestHandler');

    /**
     * @param {yak.api.StartInstanceRequest} request
     * @returns {yak.api.StartInstanceResponse} response
     */
    this.handle = function handle(request) {
        var response =  new yak.api.StartInstanceResponse(request.id);

        try {
            var instances = yakServer.instanceManager.getInstances();

            instances
                .filter(instance => instance.state === yak.InstanceState.RUNNING)
                .forEach(instance => {
                    instance.stop();
                    instance.start();
                });

        } catch (ex) {
            response.success = false;
            log.warn('Could not restart all started instances.')
        }

        return response;
    };
};
