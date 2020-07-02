'use strict';

import {CommandItem} from './CommandItem.js';
import {InstanceState} from '../../../instance/instanceState.js';
import {GetCommandsResponse} from './GetCommandsResponse.js';

/**
 * @param request
 * @param response
 */
function handleRequest(request, response) {
    /**
     * @type {InstanceManager}
     */
    const instanceManager = request.app.locals.service.instanceManager;

    /**
     * @type {Array<WorkerInstance>}
     */
    const instances = instanceManager.getInstances();
    const startedInstances = instances.filter(isStarted);

    const commands = [];

    for(const instance of startedInstances) {
        for(const plugin of instance.plugins) {
            if (plugin.commands) {
                for (const command of plugin.commands) {
                    commands.push(new CommandItem({
                        instanceId: instance.yakInstance.id,
                        pluginName: plugin.name,
                        name: command.name,
                        displayName: command.displayName,
                        description: command.description,
                        data: command.data || command.exampleData
                    }));
                }
            }
        }
    }

    response.send(new GetCommandsResponse(commands));
}

function isStarted(instance) {
    return instance.state && instance.state === InstanceState.STARTED;
}

export default {
    method: 'get',
    path: '/commands',
    handler: handleRequest,
    schemas: [
        CommandItem
    ]
};
