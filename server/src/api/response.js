/**
 * Response interface.
 * @interface
 */
yak.api.Response = function Response() {
    /**
     * The unique request id. The response matching to the corresponding request.
     * @type {?string}
     */
    this.requestId = null;

    /**
     * Whether the request was successfully or not.
     * @type {boolean}
     */
    this.success = true;
};
