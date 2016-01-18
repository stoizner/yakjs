'use strict';

var fs = require('fs');
var RequestSender = require('./requestSender').RequestSender;
var requestSender = new RequestSender();

/**
 * An integration test that uploads 100 plugin files to a running YAKjs.
 */
(function uploadPluginLoadTest() {
    var pluginCode = fs.readFileSync('broadcast.plugin.js', 'utf-8');

    var COUNT = 100;
    var successCount = 0;

    var requests = [];

    for (var i=0; i < COUNT; i++) {
        var filename = 'broadcast' + i + '.plugin.js';
        var request = createFileUploadRequest(filename, pluginCode);

        requests.push(requestSender.sendRequest(request).then(function() {
            successCount++;
        }).catch(function (error) {
            console.warn(error)
        }));
    }

    Promise.all(requests).then(function() {
        if (successCount !== COUNT) {
            console.error('uploadPluginLoadTest failed. Failed requests: ' + (COUNT - successCount));
            process.exit(-1);
        } else {
            console.log('uploadPluginLoadTest succeeded.')
        }
    })

}());

/**
 * @param {string} filename
 * @param {string} content
 * @returns {{type: string, id: string, filename: *, content: *, enableInstanceRestart: boolean}}
 */
function createFileUploadRequest(filename, content) {
    return {
        type: 'request.uploadFileRequest',
        id: 'requestId',
        filename: filename,
        content: content,
        enableInstanceRestart: true
    }
}