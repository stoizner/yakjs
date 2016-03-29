var sandbox = require('../integrationTestSandbox');
var expect = sandbox.expect;

describe('Test echo instance and echo plugin', function() {
    'use strict';

    var ECHO_INSTANCE = 'ws://localhost:9010/';

    var WebSocket = require('ws');

    var ws;

    /**
     * Setup before each test
     */
    beforeEach(function() {
        ws = new WebSocket('ws://localhost:9010/');
    });

    it('echo plugin shall replay with sent message', function(done) {
        // Given
        var testMessage = 'this is a test message';

        ws.on('open', function open() {
            ws.send(testMessage);
        });

        // When
        ws.on('message', function(data, flags) {
            expect(data).to.be.eql(testMessage);
            done();
        });
    });
});
