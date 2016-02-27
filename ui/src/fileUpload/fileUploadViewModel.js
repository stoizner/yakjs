/**
 * FileUploadViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.FileUploadViewModel = function FileUploadViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.FileUploadViewModel}
     */
    var self = this;

    /**
     * @type {Object<string, {}>}
     */
    var fileUploadItems = {};

    /**
     * @type {function(Array<{}>)}
     */
    this.onFileUploadItemsChanged = _.noop;

    /**
     * @type {function(Array<{}>)}
     */
    this.onFileUploadCompleted = _.noop;

    /**
     * Upload files to the YAKjs server.
     * @param {!Array<File>} files
     */
    this.uploadFiles = function uploadFiles(files) {
        fileUploadItems = {};

        _.each(files, readFile);

        self.onFileUploadItemsChanged(_.toArray(fileUploadItems));
    };

    /**
     * Handle every dropped file.
     * @param {File} file
     */
    function readFile(file) {
        console.log('Reading file', {file: file});

        var reader = new FileReader();
        var filename = file.name;

        // Closure to capture the file information.
        reader.onload = _.partial(uploadFile, file);

        fileUploadItems[filename] = createFileUploadItem(file.name);

        // Read in the file as a data URL.
        reader.readAsText(file);
    }

    /**
     * Handles the load event from the FileReader and uploads the file.
     * @param {File} file
     * @param {?} event
     */
    function uploadFile(file, event) {
        var filename = file.name;
        var content = event.target.result;

        console.log('uploadFile', {filename: filename});

        var uploadFileRequest = new yak.api.UploadFileRequest();
        uploadFileRequest.filename = filename;
        uploadFileRequest.content = content;
        uploadFileRequest.enableInstanceRestart = false;

        context.adapter.sendRequest(uploadFileRequest, _.partial(handleUploadFileResponse, filename));
    }

    /**
     * Creates a file upload info with a file name.
     * @param {string} filename
     */
    function createFileUploadItem(filename) {
        return {
            filename: filename,
            pending: true,
            type: 'unknown',
            success: false,
            status: ''
        };
    }

    /**
     * @param {string} filename
     * @param {yak.api.UploadFileResponse} response
     */
    function handleUploadFileResponse(filename, response) {
        console.log('handleUploadFileResponse', {response: response});

        fileUploadItems[filename].success = response.success;
        fileUploadItems[filename].errorMessage = response.message;
        fileUploadItems[filename].fileType = response.fileType;
        fileUploadItems[filename].pending = false;

        if (_.every(fileUploadItems, function notPending(item) { return !item.pending; })) {
            self.onFileUploadCompleted(_.toArray(fileUploadItems));
        }

        self.onFileUploadItemsChanged(_.toArray(fileUploadItems));
    }
};
