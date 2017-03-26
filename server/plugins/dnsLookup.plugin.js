/**
 * @name dnsLookup
 * @description Resolves a hostname (e.g. 'example.com') into the first found A (IPv4).
 * @version 1.0.0
 * @type WebSocketServerPlugin
 * @constructor 
 * @implements 
 * @param require
 */
function DnsLookupPlugin(require) {
    'use strict';

    var dns = require('dns');

    this.onStart = function onStart() {};

    /**
     * @param {yak.WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {yak.WebSocketMessage} message
     * @param {yak.WebSocketConnection} connection
     */
    this.onJsonMessage = function onJsonMessage(message, connection) {
        if (message.data.action === 'lookup') {
            dns.lookup(message.data.hostname, 4, function(err, address, family) {
                connection.send({address: address});
            })
        }
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {yak.WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop() {};
}


