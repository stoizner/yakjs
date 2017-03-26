/**
 * Upload a file to add or update an instance, plugin or store.
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.UploadFileRequest = function UploadFileRequest() {
    'use strict';

    /**
     * The original filename.
     * @type {?string}
     */
    this.filename = null;

    /**
     * The UTF-8 file content.
     * @type {?string}
     */
    this.content = null;
};
