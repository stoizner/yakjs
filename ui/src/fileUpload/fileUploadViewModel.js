/**
 * FileUploadViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.FileUploadViewModel = function FileUploadViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.HeaderViewModel}
     */
    var self = this;

    /**
     * Upload a file to yakjs.
     * @param {string} filename
     * @param {string} content
     */
    this.uploadFile = function uploadFile(filename, content) {
        console.log('uploadFile', {filename: filename, content: content});
        var uploadFileRequest = new yak.api.UploadFileRequest();
        uploadFileRequest.filename = filename;
        uploadFileRequest.content = content;
        uploadFileRequest.enableInstanceRestart = true;

        context.webSocket.send(uploadFileRequest);
    };
};
