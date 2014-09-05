/**
 * ServerInstance
 * @interface
 */
yak.ServerInstance = function ServerInstance() {
    /**
     * The unique instance name.
     * @type {null}
     */
    this.name = null;

    /**
     * Start instance.
     */
    this.start = function start() {};

    /**
     * Stop instance.
     */
    this.stop = function stop() {};

    /**
     * Description
     * @type {string}
     */
    this.description = '';

    /**
     * @type {yak.Logger}
     */
    this.log = new yak.Logger('');
};
