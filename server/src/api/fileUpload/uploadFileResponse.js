/**
 * UploadFileResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.UploadFileResponse = function UploadFileResponse(requestId) {
    'use strict';

    /**
     * @type {string}
     */
    this.type = 'response.uploadFileResponse';

    /**
     * The original request id.
     * @type {string}
     */
    this.requestId = requestId;

    /**
     * Whether the request was successfully or not.
     * @type {boolean}
     */
    this.success = true;

    /**
     * Optional: Message if no success.
     * @type {string}
     */
    this.message = '';

    /**
     * The file type.
     * @type {string}
     */
    this.fileType = '';

    /**
     * A list of possible affected instances by the file upload request.
     * Data is only available for plugins.
     * @type {!Array<string>}
     */
    this.affectedInstanceIds = [];
};
