require('../../testSandbox');

describe('PluginParser', function() {
    'use strict';

    /**
     * @type {!yak.PluginParser}
     */
    var sut;

    var fs = require('fs');

    /**
     * Setup before each test
     */
    beforeEach(function() {
        sut = new yak.PluginParser();
    });

    describe('parse', function() {
        it('create a simple plugin', function() {
            // Given
            var code = loadPluginCode('simple.plugin.js');

            // When
            var plugin = sut.parse('simplePlugin.plugin.js', code);

            // Then
            expect(plugin.name).to.be.equal('simplePlugin');
            expect(plugin.id).to.be.equal('simplePlugin');
            expect(plugin.description).to.be.equal('A simple plugin.');
            expect(plugin.version).to.be.equal('1.0.0');
        });

        it('#47 - dollar var breaks plugin', function() {
            // Given
            var code = loadPluginCode('dollarBreak.plugin.js');

            // When
            var plugin = sut.parse('dollarBreak.plugin.js', code);

            // Then
            expect(plugin.name).to.be.equal('dollarBreak');
            expect(plugin.id).to.be.equal('dollarBreak');
            expect(plugin.description).to.be.equal('Fixing issue #47.');
            expect(plugin.version).to.be.equal('0.1.0');
        });
    });

    /**
     * Loads a plugin file
     * @param {string} name
     */
    function loadPluginCode(name) {
        return fs.readFileSync(__dirname + '/' + name, {encoding: 'utf8'});
    }
});
