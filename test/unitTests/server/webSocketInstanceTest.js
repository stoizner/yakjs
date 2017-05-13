const sandbox = require('../../testSandbox');
const sinon = sandbox.sinon;
const expect = sandbox.expect;
const WebSocketInstance = require('../../../server/core/instance/webSocketInstance');
const InstanceState = require('../../../server/core/instance/instanceState');

describe('WebSocketInstance', function() {
    'use strict';

    /**
     * @type {!WebSocketInstance}
     */
    var sut;

    /**
     *  @type {PluginManager}
     */
    var pluginManagerStub;

    beforeEach(function() {
        pluginManagerStub = {
            createPluginWorker: sinon.spy()
        };

        sut = new WebSocketInstance(pluginManagerStub, 'test', 8791);
    });

    describe('start', function() {
        it('create a plugin instance', function() {
            // Given
            sut.plugins = ['myPlugin'];

            // When
            sut.start();

            // Then
            expect(pluginManagerStub.createPluginWorker).to.have.been.calledWith('myPlugin');
        });

        it('call onInitialize on plugin', function() {
            // Given
            sut.plugins = ['myPlugin'];
            var plugin = {
                name: 'myPlugin',
                onInitialize: sinon.spy()
            };
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);

            // When
            sut.start();

            // Then
            expect(plugin.onInitialize).calledWith();
        });

        it('call onStart on plugin', function() {
            // Given
            sut.plugins = ['myPlugin'];
            var plugin = {
                name: 'myPlugin',
                onStart: sinon.spy()
            };
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);

            // When
            sut.start();

            // Then
            expect(plugin.onStart).calledWith();
        });

        it('do not call onInitialize when plugin does not have a onInitialize method', function() {
            // Given
            sut.plugins = ['myPlugin'];
            var plugin = {name: 'myPlugin'};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);

            // When
            sut.start();

            // Then
            expect(sut.state).to.not.equal(InstanceState.ERROR);
        });

        it('plugin without onInitialize shall be added to active plugins', function() {
            // Given
            sut.plugins = ['myPlugin'];
            var plugin = {name: 'myPlugin'};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);

            // When
            sut.start();

            // Then
            expect(sut.getPluginInstances()[0]).to.be.eql(plugin);
        });

        it('count active plugins', function() {
            // Given
            sut.plugins = ['myPlugin'];
            var plugin = {name: 'myPlugin'};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);

            // When
            sut.start();

            // Then
            expect(sut.activePluginCount).to.eql(1);
        })
    });

    describe('stop', function() {
        it('calls onTerminate on plugin', function() {
            // Given
            sut.plugins = ['myPlugin'];
            var plugin = {name: 'myPlugin', onTerminate: sinon.spy()};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);
            sut.start();
            sut.state = InstanceState.RUNNING;

            // When
            sut.stop();

            // Then
            expect(plugin.onTerminate).calledWith();
        });

        it('calls onStop on plugin', function() {
            // Given
            sut.plugins = ['myPlugin'];
            var plugin = {name: 'myPlugin', onStop: sinon.spy()};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);
            sut.start();
            sut.state = InstanceState.RUNNING;

            // When
            sut.stop();

            // Then
            expect(plugin.onStop).calledWith();
        });
    });
});
