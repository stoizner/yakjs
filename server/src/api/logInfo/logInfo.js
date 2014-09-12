/**
 * LogInfo
 * @constructor
 */
yak.api.LogInfo = function LogInfo() {
    /**
     * Log Level (info|warn|error|debug)
     * @type {string}
     */
    this.level = null;

    /**
     * category name.
     * @type {?string}
     */
    this.category = null;

    /**
     * Log information.
     * @type {?string}
     */
    this.info = null;

    /**
     * ISO DateTime format when the log entry was created.
     * @type {?string}
     */
    this.time = null;
};
