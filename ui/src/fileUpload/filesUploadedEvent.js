/**
 * FilesUploadedEvent
 * Event raised by {yak.ui.FileUploadViewModel} after response.
 * @constructor
 */
yak.ui.FilesUploadedEvent = function FilesUploadedEvent() {
    'use strict';

    this.type = 'ui.event.filesUploaded';

    /**
     * List of uploaded files and its success status.
     * @type {!Array<{filename: string, success: boolean, type: string, errorMessage: string}>}
     */
    this.uploadedFiles = [];
};
