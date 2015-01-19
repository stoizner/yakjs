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
};
