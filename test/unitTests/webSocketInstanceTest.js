var sandbox = require('../testSandbox');
var sinon = sandbox.sinon;
var expect = sandbox.expect;

describe('WebSocketInstance', function() {
    'use strict';

    /**
     * @type {yak.WebSocketInstance}
     */
    var sut;

    /**
     *  @type {yak.PluginManager}
     */
    var pluginManagerStub;

    /**
     * Setup before each test
     */
    beforeEach(function() {
        pluginManagerStub = {
            createPluginWorker: sinon.spy()
        };

        sut = new yak.WebSocketInstance(pluginManagerStub, 'test', 8791);
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
            expect(sut.state).to.not.equal(yak.InstanceState.ERROR);
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
        it('shall call onTerminate on plugin', function() {
            // Given
            sut.plugins = ['myPlugin'];
            var plugin = {name: 'myPlugin', onTerminate: sinon.spy()};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);
            sut.start();
            sut.state = yak.InstanceState.RUNNING;

            // When
            sut.stop();

            // Then
            expect(plugin.onTerminate).calledWith();
        });

        it('shall call onStop on plugin', function() {
            // Given
            sut.plugins = ['myPlugin'];
            var plugin = {name: 'myPlugin', onStop: sinon.spy()};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);
            sut.start();
            sut.state = yak.InstanceState.RUNNING;

            // When
            sut.stop();

            // Then
            expect(plugin.onStop).calledWith();
        });
    });
});
