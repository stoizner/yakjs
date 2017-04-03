'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

const dns = require('dns');

/**
 * Resolves a hostname (e.g. 'example.com') into the first found A (IPv4).
 * @constructor
 * @struct
 */
function DnsLookupPlugin(require) {
    this.onStart = function onStart() {};

    /**
     * @param {WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {WebSocketMessage} message
     * @param {WebSocketConnection} connection
     */
    this.onJsonMessage = function onJsonMessage(message, connection) {
        if (message.data.action === 'lookup') {
            const IPV4 = 4;
            dns.lookup(message.data.hostname, IPV4, function(err, address, family) {
                connection.send({address: address});
            });
        }
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop() {};
}

module.exports = {
    name: 'dnsLookup',
    description: 'Resolves a hostname (e.g. "example.com") into the first found A (IPv4).',
    createWorker: context => new DnsLookupPlugin(context)
};

