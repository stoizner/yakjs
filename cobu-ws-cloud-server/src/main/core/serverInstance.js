/**
 * ServerInstance
 * @interface
 */
cobu.wsc.ServerInstance = function ServerInstance() {

    'use strict';

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
     * @type {cobu.wsc.Logger}
     */
    this.log = new cobu.wsc.Logger('');
};