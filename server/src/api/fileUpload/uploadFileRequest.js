/**
 * Upload a file to add or update an instance, plugin or store.
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.UploadFileRequest = function UploadFileRequest() {
    'use strict';

    /**
     * @type {string}
     */
    this.type = 'request.UploadFileRequest';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

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

    /**
     * Whether to restart an instance that is related to the file.
     * @type {boolean}
     */
    this.enableInstanceRestart = false;
};
