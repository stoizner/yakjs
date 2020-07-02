'use strict';

import {sinon, expect} from '../../testSandbox';
import {CommandDispatcher} from '../../../src/command/CommandDispatcher';
import {YakPluginCommand} from '../../../src/YakPluginCommand';
import {ConsoleLogger} from '../../../log/ConsoleLogger';

describe('commandDispatcher', function() {
    /**
     * @type {!PluginContext}
     */
    const context = /* {@type {!PluginContext} */(sinon.stub());

    /**
     * @type {CommandDispatcher}
     */
    let commandDispatcher = null;

    /**
     * @type {Service}
     */
    let service = {};

    beforeEach(function() {
        service = {
            log: new ConsoleLogger({logLevels: []}),
        };
        commandDispatcher = new CommandDispatcher(service);
    });

    describe('register()', function() {
        it('registers one command configuration', function() {
            // Given
            const commandFoo = createCommand('foo', 'About foo', sinon.spy());

            // When
            commandDispatcher.register(commandFoo, context);

            // Then
            expect(commandDispatcher.getCommandWorkers('foo')[0].command).to.equal(commandFoo);
            expect(commandDispatcher.getCommandWorkers('foo')[0].pluginContext).to.equal(context);
        });

        it('registers two command configuration', function() {
            // Given
            const commandFooA = createCommand('foo', 'About foo', sinon.spy());
            const commandFooB = createCommand('foo', 'About foo', sinon.spy());

            // When
            commandDispatcher.register(commandFooA, context);
            commandDispatcher.register(commandFooB, context);

            // Then
            const commands = commandDispatcher.getCommandWorkers('foo');
            expect(commands[0].command).to.equal(commandFooA);
            expect(commands[1].command).to.equal(commandFooB);
        });
    });

    describe('execute()', function() {
        it('calls the commandHandler', async function() {
            // Given
            const commandFoo = new YakPluginCommand({
                name: 'foo',
                description: 'About foo',
                data: 'data',
                execute: sinon.spy()
            });
            const context = {};

            // When
            commandDispatcher.register(commandFoo, context);
            await commandDispatcher.execute('foo');

            // Then
            expect(commandFoo.execute).to.be.calledWith(commandFoo.data, context, commandFoo);
        });
    });

    describe('unregisterAll()', function() {
        it('clears all commands', function() {
            // Given
            const commandFoo = createCommand('foo', 'About foo', sinon.spy());
            commandDispatcher.register(commandFoo, context);

            // When
            commandDispatcher.commandMap.clear();

            // Then
            expect(commandDispatcher.getCommandWorkers('foo')).to.deep.equal([]);
        });
    });

    describe('unregisterAllWithContext()', function() {
        it('unregisters all commands that references the given context', function() {
            // Given
            const contextA = {};
            const contextB = {};
            const commandFooA = new YakPluginCommand({name: 'foo'});
            const commandFooB = new YakPluginCommand({name: 'foo'});
            commandDispatcher.register(commandFooA, contextA);
            commandDispatcher.register(commandFooB, contextB);

            // When
            commandDispatcher.unregisterAllWithContext(contextA);

            // Then
            expect(commandDispatcher.getCommandWorkers('foo')[0].pluginContext).to.equal(contextB);

        });
    });

    /**
     *
     * @param name
     * @param description
     * @param executeHandler
     * @returns {{name: *, description: *, execute: *}}
     */
    function createCommand(name, description, executeHandler) {
        return new YakPluginCommand({
            name: name,
            description: description,
            execute: executeHandler
        });
    }
});
