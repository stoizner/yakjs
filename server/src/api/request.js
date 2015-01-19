/**
 * Request interface.
 * @interface
 */
yak.api.Request = function Request() {
    /**
     * The unique request id. Shall be set automatically by the request implementation constructor.
     * @type {?string}
     */
    this.id = null;

    /**
     * The request type.
     * @type {?string}
     */
    this.type = null;
};
