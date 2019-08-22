'use strict';

const sandbox = require('../../testSandbox');
const sinon = sandbox.sinon;
const expect = sandbox.expect;

const commandDispatcher = require('../../../server/src/command/commandDispatcher');

describe('commandDispatcher', function() {
    /**
     * @type {!PluginContext}
     */
    const context = /* {@type {!PluginContext} */(sinon.stub());

    beforeEach(function() {
        commandDispatcher.unregisterAll();
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
            expect(commandDispatcher.getCommands('foo')[0].config).to.equal(commandFooA);
            expect(commandDispatcher.getCommands('foo')[1].config).to.equal(commandFooB);
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
            commandDispatcher.unregisterAll();

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

    function createCommand(name, description, executeHandler) {
        return {
            name: name,
            description: description,
            execute: executeHandler
        };
    }
});
