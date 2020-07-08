'use strict';

import {sinon, expect} from '../../testSandbox.js';
import {WebSocketInstance} from '../../../src/instance/webSocketInstance.js';
import {InstanceState} from '../../../src/instance/instanceState.js';
import {YakInstance} from '../../../src/YakInstance.js';
import {ConsoleLogger} from '../../../log/ConsoleLogger.js';

describe('WebSocketInstance', function() {
    /**
     * @type {!WebSocketInstance}
     */
    let sut;

    /**
     * @type {PluginManager}
     */
    let pluginManagerStub;

    /**
     * @type {CommandDispatcher}
     */
    let commandDispatcherStub;

    /**
     * @type {Service}
     */
    let service = {};

    /**
     * @type {YakInstance}
     */
    let yakInstance;

    /**
     * @type {Plugin}
     */
    let myPlugin;

    /**
     * @type {PluginWorker}
     */
    let myPluginWorker;

    beforeEach(function() {
        pluginManagerStub = {
            createPluginWorker: sinon.spy(),
            getPlugin: sinon.stub().returns({})
        };

        commandDispatcherStub = {
            unregisterAllWithContext: sinon.stub()
        };

        service = {
            log: new ConsoleLogger({logLevels: []}),
            pluginManager: pluginManagerStub,
            commandDispatcher: commandDispatcherStub
        };

        yakInstance = new YakInstance({
            id: 'testInstance',
            port: 9020
        });

        myPluginWorker = createSpyWorker();

        myPlugin = {
            name: 'myPlugin',
            createWorker: sinon.stub().returns(myPluginWorker)
        };

        sut = new WebSocketInstance(service, yakInstance);
    });

    describe('start', function() {
        afterEach(async function() {
            await sut.stop();
        });

        it('create a plugin instance', async function() {
            // Given
            yakInstance.plugins = [myPlugin];

            // When
            await sut.start();

            // Then
            expect(myPlugin.createWorker).to.have.been.called();
        });

        it('calls onStart on plugin', async function() {
            // Given
            myPluginWorker.onStart = sinon.spy();
            yakInstance.plugins = [myPlugin];

            // When
            await sut.start();

            // Then
            expect(myPluginWorker.onStart).to.be.called();
        });

        it('calls onInitialize on plugin when no onStart is available', async function() {
            // Given
            myPluginWorker.onInitialize = sinon.spy();
            yakInstance.plugins = [myPlugin];

            // When
            await sut.start();

            // Then
            expect(myPluginWorker.onInitialize).to.be.called();
        });

        it('calls onInstanceStarted', async function() {
            // Given
            myPluginWorker.onInstanceStarted = sinon.spy();
            yakInstance.plugins = [myPlugin];

            // When
            await sut.start();

            // Then
            expect(myPluginWorker.onInstanceStarted).to.be.called();
        });
    });

    describe('stop', function() {
        it('calls onTerminate on plugin when onStop is not defined', async function() {
            // Given
            myPluginWorker.onTerminate = sinon.spy();
            yakInstance.plugins = [myPlugin];
            await sut.start();
            sut.state = InstanceState.STARTED;

            // When
            await sut.stop();

            // Then
            expect(myPluginWorker.onTerminate).to.be.called();
        });

        it('calls onStop on plugin', async function() {
            // Given
            myPluginWorker.onStop = sinon.spy();
            yakInstance.plugins = [myPlugin];
            await sut.start();
            sut.state = InstanceState.STARTED;

            // When
            await sut.stop();

            // Then
            expect(myPluginWorker.onStop).to.be.called();
        });
    });

    /**
     * @returns {PluginWorker}
     */
    function createSpyWorker() {
        return {
            onStart: undefined,
            onInitialize: undefined,
            onInstanceStarted: undefined,
            onNewConnection: undefined,
            onMessage: undefined,
            onJsonMessage: undefined,
            onConnectionClosed: undefined,
            onStop: undefined,
            onTerminate: undefined
        }
    }
});
