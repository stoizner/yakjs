/**
 * Config
 * @constructor
 */
cobu.wsc.Config = function Config() {

    'use strict';

    /** @type {cobu.wsc.Config} */
    var self = this;

    /**
     * The API service web socket service port.
     * @type {number}
     */
    this.servicePort = 8790;

    /**
     * @type {Array.<cobu.wsc.InstanceConfigItem>}
     */
    this.instances = [];

    /**
     * @type {Array.<cobu.wsc.PluginConfigItem>}
     */
    this.plugins = [];

    /** Constructor */
    function constructor() {

        createDefaultInstanceConfig();
        createDefaultPluginConfig();
    }

    /**
     * Creates default instance config.
     */
    function createDefaultInstanceConfig() {
        var echoInstance = new cobu.wsc.InstanceConfigItem();
        echoInstance.name = 'Echo Service';
        echoInstance.description = 'Every received message will be returned to sender.';
        echoInstance.port = 8791;
        echoInstance.plugins = ['echo'];
        self.instances.push(echoInstance);
    }

    /**
     * Creates default plugin config.
     */
    function createDefaultPluginConfig() {

        // ECHO Plugin
        var echoPlugin = new cobu.wsc.PluginConfigItem();
        echoPlugin.name = 'echo';
        echoPlugin.description = 'Echo service. Every received message will be returned.';
        echoPlugin.code = cobu.wsc.EchoPluginWorker.toString();
        self.plugins.push(echoPlugin);

        // PING-PONG Plugin
        var pingpongPlugin = new cobu.wsc.PluginConfigItem();
        pingpongPlugin.name = 'ping-pong';
        pingpongPlugin.description = 'ping will be answered with pong';
        pingpongPlugin.code = cobu.wsc.PingPongPluginWorker.toString();
        self.plugins.push(pingpongPlugin);

        // HELLO-WORLD_CONSOLE Plugin
        var helloWorldPlugin = new cobu.wsc.PluginConfigItem();
        helloWorldPlugin.name = 'hello-world-console';
        helloWorldPlugin.description = 'Write "hello world" to server console.';
        helloWorldPlugin.code = 'function HelloWorld() { this.onMessage = function onMessage(message, connection, instance) { console.log("hello world"); }; }';
        self.plugins.push(helloWorldPlugin);
    }

    constructor();
};