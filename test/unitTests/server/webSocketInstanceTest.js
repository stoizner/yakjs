'use strict';

const sandbox = require('../../testSandbox');
const sinon = sandbox.sinon;
const expect = sandbox.expect;
const WebSocketInstance = require('../../../server/src/instance/webSocketInstance');
const InstanceState = require('../../../server/src/instance/instanceState');

describe('WebSocketInstance', function() {
    /**
     * @type {!WebSocketInstance}
     */
    let sut;

    /**
     *  @type {PluginManager}
     */
    let pluginManagerStub;

    beforeEach(function() {
        pluginManagerStub = {
            createPluginWorker: sinon.spy(),
            getPlugin: sinon.stub().returns({})
        };

        sut = new WebSocketInstance(pluginManagerStub, 'test', 9002);
    });

    describe('start', function() {
        afterEach(async function() {
            await sut.stop();
        });

        it('create a plugin instance', async function() {
            // Given
            sut.plugins = ['myPlugin'];

            // When
            await sut.start();

            // Then
            expect(pluginManagerStub.createPluginWorker).to.have.been.calledWith('myPlugin');
        });

        it('calls onInitialize on plugin', async function() {
            // Given
            sut.plugins = ['myPlugin'];
            const plugin = {
                name: 'myPlugin',
                onInitialize: sinon.spy()
            };
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);

            // When
            await sut.start();

            // Then
            expect(plugin.onInitialize).calledWith();
        });

        it('calls onStart on plugin', async function() {
            // Given
            sut.plugins = ['myPlugin'];
            const plugin = {
                name: 'myPlugin',
                onStart: sinon.spy()
            };
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);

            // When
            await sut.start();

            // Then
            expect(plugin.onStart).calledWith();
        });

        it('do not call onInitialize when plugin does not have a onInitialize method', async function() {
            // Given
            sut.plugins = ['myPlugin'];
            const plugin = {name: 'myPlugin'};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);

            // When
            await sut.start();

            // Then
            expect(sut.state).not.to.deep.equal(InstanceState.ERROR);
        });

        it('plugin without onInitialize shall be added to active plugins', async function() {
            // Given
            sut.plugins = ['myPlugin'];
            const plugin = {name: 'myPlugin'};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);

            // When
            await sut.start();

            // Then
            expect(sut.getPluginInstances()[0]).to.be.eql(plugin);
        });

        it('count active plugins', async function() {
            // Given
            sut.plugins = ['myPlugin'];
            const plugin = {name: 'myPlugin'};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);

            // When
            await sut.start();

            // Then
            expect(sut.activePluginCount).to.eql(1);
        });

        it('calls onInstanceStarted', async function() {
            // Given
            sut.plugins = ['myPlugin'];
            const plugin = {
                name: 'myPlugin',
                onInstanceStarted: sinon.spy()
            };
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);

            // When
            await sut.start();

            // Then
            expect(plugin.onInstanceStarted).calledWith();
        });
    });

    describe('stop', function() {
        it('calls onTerminate on plugin', async function() {
            // Given
            sut.plugins = ['myPlugin'];
            const plugin = {name: 'myPlugin', onTerminate: sinon.spy()};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);
            await sut.start();
            sut.state = InstanceState.RUNNING;

            // When
            await sut.stop();

            // Then
            expect(plugin.onTerminate).called();
        });

        it('calls onStop on plugin', async function() {
            // Given
            sut.plugins = ['myPlugin'];
            const plugin = {name: 'myPlugin', onStop: sinon.spy()};
            pluginManagerStub.createPluginWorker = sinon.stub().returns(plugin);
            await sut.start();
            sut.state = InstanceState.RUNNING;

            // When
            await sut.stop();

            // Then
            expect(plugin.onStop).called();
        });
    });
});
