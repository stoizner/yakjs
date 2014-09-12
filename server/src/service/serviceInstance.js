/**
 * ServiceInstance
 * @constructor
 * @param {string} name
 * @param {number} port
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServerInstance}
 */
yak.ServiceInstance = function ServiceInstance(name, port, yakServer) {
    var WebSocketServer = require('ws').Server;

    /*
     * @type {yak.WebSocketInstance}
     */
    var self = this;

    /**
     * @type {WebSocketServer}
     */
    var server = null;

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @type {yak.ServiceWorker}
     */
    var serviceWorker = null;

    /**
     * @type {Object.<string, yak.WebSocketConnection>}
     */
    var connections = {};

    /**
     * The unique instance name.
     * @type {null}
     */
    this.name = 'service';

    /**
     * Description
     * @type {string}
     */
    this.description = 'internal service instance';

    /**
     * Server port
     * @type {number} default: 8790;
     */
    this.port = port || 8790;

    /**
     * @type {yak.Logger}
     */
    this.log = log;

    /**
     * Constructor
     */
    function constructor() {
        serviceWorker = new yak.ServiceWorker(yakServer);
    }

    /**
     * Start instance.
     */
    this.start = function start() {
        log.info('Start service Instance.');
        startServer();
    };

    /**
     * Stop instance.
     */
    this.stop = function stop() {
        try {
            if (server) {
                self.log.info('Stopping ServiceInstance...');
                server.close();
                server = null;
            }
        } catch (ex) {
            self.log.error('Could not stop instance: ', ex);
        }
    };

    /**
     * Start the web socket.
     */
    function startServer() {
        log.info('Start web socket server.', {port: self.port});
        server = new WebSocketServer({port: self.port});
        server.on('connection', handleConnection);
    }

    /**
     * Creates a handler function to handle connection events.
     * @param {?} socket
     */
    function handleConnection(socket) {

        var connection = new yak.WebSocketConnection();
        connection.socket = socket;

        log.info('Client connected.', { connectionId: connection.id });

        connections[connection.id] = connection;

        socket.on('close', function handleClose() {
            log.info('close', { connectionId: connection.id });
            connections[connection.id] = null;
        });

        socket.on('message', createMessageHandler(connection));
    }

    /**
     * @param {yak.WebSocketConnection} connection
     * @returns {Function} A hanlde message function closure.
     */
    function createMessageHandler(connection) {
        return function handleMessage(data, flags) {
            log.info('Message received.', { connectionId: connection.id, data: data });
            serviceWorker.onMessage(new yak.WebSocketMessage(data), connection, self);
        };
    }

    constructor();
};
