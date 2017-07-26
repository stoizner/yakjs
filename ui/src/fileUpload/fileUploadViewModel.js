/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function FileUploadViewModel(context) {
    'use strict';

    /**
     * @type {FileUploadViewModel}
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

        var fileContainer = {
            filename: filename,
            content: content
        };

        context.adapter.post('/upload/file', {fileContainer: fileContainer})
            .then(_.partial(handleUploadFileResponse, filename, true))
            .catch(_.partial(handleUploadFileResponse, filename, false));
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
     * @param {!Object} response
     */
    function handleUploadFileResponse(filename, success, response) {
        console.log('handleUploadFileResponse', {response: response});

        fileUploadItems[filename].success = success;
        fileUploadItems[filename].errorMessage = response.message;
        fileUploadItems[filename].fileType = response.fileType;
        fileUploadItems[filename].pending = false;

        if (_.every(fileUploadItems, function notPending(item) { return !item.pending; })) {
            self.onFileUploadCompleted(_.toArray(fileUploadItems));
        }

        self.onFileUploadItemsChanged(_.toArray(fileUploadItems));
    }
}

module.exports = FileUploadViewModel;
