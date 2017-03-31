'use strict';

const state = require('../../../yakServerState');
const fileExtension = require('../../../infrastructure/fileExtension');
const hasExtension = require('../../../util/hasExtension');
const storeProvider = require('../../../store/storeProvider');
const HttpStatus = require('http-status-codes');

const uploadHandlers = {};
uploadHandlers[fileExtension.INSTANCE_EXTENSION] = state.instanceManager.upload;
uploadHandlers[fileExtension.PLUGIN_EXTENSION] = state.pluginManager.upload;
uploadHandlers[fileExtension.MODULE_EXTENSION] = state.moduleProvider.upload;
uploadHandlers[fileExtension.STORE_EXTENSION] = storeProvider.upload;
uploadHandlers[fileExtension.STORE_EXTENSION_OLD] = storeProvider.upload;

const fileTypes = {};
fileTypes[fileExtension.INSTANCE_EXTENSION] = 'instance';
fileTypes[fileExtension.PLUGIN_EXTENSION] = 'plugin';
fileTypes[fileExtension.MODULE_EXTENSION] = 'module';
fileTypes[fileExtension.STORE_EXTENSION] = 'store';
fileTypes[fileExtension.STORE_EXTENSION_OLD] = 'store';

/**
 * @param request
 * @param response
 */
function postUploadFileRoute(request, response) {
    /**
     * @type {!FileContainer}
     */
    const container = request.body.fileContainer;

    if (container && container.filename) {
        let extensionKey = Object.keys(fileExtension).find(key => hasExtension(container.filename, fileExtension[key]));
        let extension = fileExtension[extensionKey];
        let upload = uploadHandlers[extension];

        let responseData = {
            filename: container.filename,
            fileType: fileTypes[extension]
        };

        if (upload) {
            upload(container)
                .then(() => response.send(responseData))
                .catch(error => {
                    response.status(HttpStatus.BAD_REQUEST).send(Object.assign(responseData, {
                        message: error
                    }));
                });
        } else {
            response.status(HttpStatus.BAD_REQUEST).send(Object.assign(responseData, {
                message: 'Can not upload file container. Extension is not supported.'
            }));
        }
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'Expected fileContainer with filename property.'
        });
    }
}

module.exports = postUploadFileRoute;
