const sandbox = require('../../testSandbox');
const sinon = sandbox.sinon;
const expect = sandbox.expect;
const proxyquire =  require('proxyquire');

const commandDispatcher = require('../../../server/src/command/commandDispatcher');

describe('commandDispatcher', function() {
    'use strict';

    /**
     * @type {!PluginContext}
     */
    var context = /* {@type {!PluginContext} */(sinon.stub());

    beforeEach(function() {
        commandDispatcher.unregisterAll();
    });

    describe('register', function() {
        it('registers one command configuration', function() {
            // Given
            let commandFoo = createCommand('foo', 'About foo', sinon.spy());

            // When
            commandDispatcher.register(commandFoo, context);

            // Then
            expect(commandDispatcher.getCommands('foo')[0].config).to.equal(commandFoo);
            expect(commandDispatcher.getCommands('foo')[0].context).to.equal(context);
        });

        it('registers two command configuration', function() {
            // Given
            let commandFooA = createCommand('foo', 'About foo', sinon.spy());
            let commandFooB = createCommand('foo', 'About foo', sinon.spy());

            // When
            commandDispatcher.register(commandFooA, context);
            commandDispatcher.register(commandFooB, context);

            // Then
            expect(commandDispatcher.getCommands('foo')[0].config).to.equal(commandFooA);
            expect(commandDispatcher.getCommands('foo')[1].config).to.equal(commandFooB);
        });
    });

    describe('execute', function() {
        it('calls the commandHandler', function() {
            // Given
            let commandFoo = createCommand('foo', 'About foo', sinon.spy());
            let context = sinon.spy();

            // When
            commandDispatcher.register(commandFoo, context);
            commandDispatcher.execute('foo', 'data', context);

            // Then
            expect(commandFoo.execute).to.be.calledWith('data', context, commandFoo);
        });

        it('returns a fulfilled promise', function() {
            // Given
            let commandFoo = createCommand('foo', 'About foo', sinon.spy());

            // When
            commandDispatcher.register(commandFoo, context);

            // Then
            return commandDispatcher.execute('foo');
        });

        it('returns a fulfilled promise for two commands', function() {
            // Given
            let commandFooA = createCommand('foo', 'About foo', sinon.stub().returns(Promise.resolve()));
            let commandFooB = createCommand('foo', 'About foo', sinon.stub().returns(Promise.resolve()));

            // When
            commandDispatcher.register(commandFooA, context);
            commandDispatcher.register(commandFooB, context);

            // Then
            return commandDispatcher.execute('foo');
        });

        it('returns a rejected promise', function() {
            // Given
            let commandFoo = createCommand('foo', 'About foo', sinon.stub().returns(Promise.reject()));

            // When
            commandDispatcher.register(commandFoo, context);
            let executePromise = commandDispatcher.execute('foo');

            // Then
            return expect(executePromise).to.be.rejected;
        });
    });

    describe('unregisterAll', function() {
        it('clears all commands', function() {
            // Given
            let commandFoo = createCommand('foo', 'About foo', sinon.spy());
            commandDispatcher.register(commandFoo, context);

            // When
            commandDispatcher.unregisterAll();

            // Then
            expect(commandDispatcher.getCommands('foo')).to.deep.equal([]);
        });
    });

    describe('unregisterAllWithContext', function() {
        it('unregisters all commands that references the given context', function() {
            // Given
            let contextA = {context: 'A'};
            let contextB = {context: 'B'};
            let commandFooA = createCommand('foo', 'About foo', () => {});
            let commandFooB = createCommand('foo', 'About foo', () => {});
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
