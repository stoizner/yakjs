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

    var fileUpload = {};

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

        context.adapter.sendRequest(uploadFileRequest, _.partial(handleUploadFileResponse, filename));
    };

    /**
     * Clear all file upload info.
     */
    this.clearFileUploadInfo = function clearFileUploadInfo() {
        fileUpload = {};
    };

    /**
     * Creates a file upload info with a file name.
     * @param {string} filename
     */
    this.createFileUploadInfo = function createFileUploadInfo(filename) {
        fileUpload[filename] = {
            filename: filename,
            pending: true,
            type: 'unknown',
            success: false,
            errorMessage: 'Upload in progress...'
        };
    };

    /**
     * @param {string} filename
     * @param {yak.api.UploadFileResponse} response
     */
    function handleUploadFileResponse(filename, response) {
        console.log('handleUploadFileResponse', {response: response});

        fileUpload[filename].success = response.success;
        fileUpload[filename].errorMessage = response.message;
        fileUpload[filename].pending = false;

        if (_.every(fileUpload, function notPending(item) { return !item.pending; })) {
            var fileUploadedEvent = new yak.ui.FilesUploadedEvent();
            fileUploadedEvent.uploadedFiles = _.toArray(fileUpload);
            context.eventBus.post(fileUploadedEvent);

            fileUpload = {};
        }
    }
};
