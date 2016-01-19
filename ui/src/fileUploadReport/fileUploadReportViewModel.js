/**
 * FileUploadReportViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.FileUploadReportViewModel = function FileUploadReportViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.FileUploadReportViewModel}
     */
    var self = this;

    /**
     * List of uploaded files and its success status.
     * @type {!Array<{filename: string, success: boolean, type: string, errorMessage: string}>}
     */
    this.uploadedFiles = [];

    /**
     * @type {Function}
     */
    this.onUploadedFilesChanged = _.noop;

    /**
     * Constructor
     */
    function constructor() {
        context.eventBus.on(yak.ui.FilesUploadedEvent).register(handleFilesUploadedEvent);

        //self.uploadedFiles.push({
        //    filename: 'file1',
        //    success: true,
        //    type: 'plugin',
        //    errorMessage: ''
        //});
        //
        //self.uploadedFiles.push({
        //    filename: 'file2',
        //    success: true,
        //    type: 'instance',
        //    errorMessage: ''
        //});
        //
        //self.uploadedFiles.push({
        //    filename: 'This is a very long file name',
        //    success: false,
        //    type: 'plugin',
        //    errorMessage: 'Something happend'
        //});
    }

    /**
     * @param {!yak.ui.FilesUploadedEvent} event
     */
    function handleFilesUploadedEvent(event) {
        self.uploadedFiles = event.uploadedFiles;
        self.onUploadedFilesChanged();
    }

    constructor();
};
