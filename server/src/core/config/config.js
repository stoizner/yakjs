/**
 * Config
 * @constructor
 */
yak.Config = function Config() {
    /**
     * The API service web socket service port.
     * @type {number}
     */
    this.servicePort = 8790;

    /**
     * @type {Array.<yak.InstanceConfigItem>}
     */
    this.instances = [];
};
