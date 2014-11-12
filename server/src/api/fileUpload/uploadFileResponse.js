/**
 * UploadFileResponse
 * @constructor
 */
yak.api.UploadFileResponse = function UploadFileResponse() {
    'use strict';

    /**
     * @type {string}
     */
    this.type = 'response.UploadFileResponse';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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
};
