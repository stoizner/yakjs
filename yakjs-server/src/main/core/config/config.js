/**
 * Config
 * @constructor
 */
yak.Config = function Config() {
    'use strict';

    /** @type {yak.Config} */
    var self = this;

    /**
     * The API service web socket service port.
     * @type {number}
     */
    this.servicePort = 8790;

    /**
     * @type {Array.<yak.InstanceConfigItem>}
     */
    this.instances = [];

    /**
     * @type {Array.<yak.PluginConfigItem>}
     */
    this.plugins = [];

    /**
     * Constructor
     */
    function constructor() {
        createDefaultInstanceConfig();
        createDefaultPluginConfig();
    }

    /**
     * Creates default instance config.
     */
    function createDefaultInstanceConfig() {
        var echoInstance = new yak.InstanceConfigItem();
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
        var echoPlugin = new yak.PluginConfigItem();
        echoPlugin.name = 'echo';
        echoPlugin.description = 'Echo service. Every received message will be returned.';
        echoPlugin.code = yak.EchoPluginWorker.toString();
        self.plugins.push(echoPlugin);

        // PING-PONG Plugin
        var pingpongPlugin = new yak.PluginConfigItem();
        pingpongPlugin.name = 'ping-pong';
        pingpongPlugin.description = 'ping will be answered with pong';
        pingpongPlugin.code = yak.PingPongPluginWorker.toString();
        self.plugins.push(pingpongPlugin);

        // BROADCAST Plugin
        var broadCastPlugin = new yak.PluginConfigItem();
        broadCastPlugin.name = 'broadcast';
        broadCastPlugin.description = 'Broadcast service. Every received message will be sent to all other connections.';
        broadCastPlugin.code = yak.BroadcastPluginWorker.toString();
        self.plugins.push(broadCastPlugin);

        // HELLO-WORLD_CONSOLE Plugin
        var helloWorldPlugin = new yak.PluginConfigItem();
        helloWorldPlugin.name = 'hello-world-console';
        helloWorldPlugin.description = 'Write "hello world" to server console.';
        helloWorldPlugin.code = 'function HelloWorld() { this.onMessage = function onMessage(message, connection, instance) { console.log("hello world"); }; }';
        self.plugins.push(helloWorldPlugin);
    }

    constructor();
};