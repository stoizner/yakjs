'use strict';

const sandbox = require('../../testSandbox');
const sinon = sandbox.sinon;
const expect = sandbox.expect;

const {CommandDispatcher} = require('../../../src/command/CommandDispatcher');
const {CommandConfig} = require('../../../src/command/commandConfig');
const {ConsoleLogger} = require('../../../log/ConsoleLogger');

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
            expect(commandDispatcher.getCommands('foo')[0].config).to.equal(commandFoo);
            expect(commandDispatcher.getCommands('foo')[0].context).to.equal(context);
        });

        it('registers two command configuration', function() {
            // Given
            const commandFooA = createCommand('foo', 'About foo', sinon.spy());
            const commandFooB = createCommand('foo', 'About foo', sinon.spy());

            // When
            commandDispatcher.register(commandFooA, context);
            commandDispatcher.register(commandFooB, context);

            // Then
            const commands = commandDispatcher.getCommands('foo');
            expect(commands[0].config).to.equal(commandFooA);
            expect(commands[1].config).to.equal(commandFooB);
        });
    });

    describe('execute()', function() {
        it('calls the commandHandler', async function() {
            // Given
            const commandFoo = createCommand('foo', 'About foo', sinon.spy());
            const context = sinon.spy();

            // When
            commandDispatcher.register(commandFoo, context);
            await commandDispatcher.execute('foo', 'data', context);

            // Then
            expect(commandFoo.execute).to.be.calledWith('data', context, commandFoo);
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
            expect(commandDispatcher.getCommands('foo')).to.deep.equal([]);
        });
    });

    describe('unregisterAllWithContext()', function() {
        it('unregisters all commands that references the given context', function() {
            // Given
            const contextA = {context: 'A'};
            const contextB = {context: 'B'};
            const commandFooA = createCommand('foo', 'About foo', () => {});
            const commandFooB = createCommand('foo', 'About foo', () => {});
            commandDispatcher.register(commandFooA, contextA);
            commandDispatcher.register(commandFooB, contextB);

            // When
            commandDispatcher.unregisterAllWithContext(contextA);

            // Then
            expect(commandDispatcher.getCommands('foo')[0].context).to.equal(contextB);

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
        return new CommandConfig({
            name: name,
            description: description,
            execute: executeHandler
        });
    }
});
