const sandbox = require('../../testSandbox');
const sinon = sandbox.sinon;
const expect = sandbox.expect;

const ServerConfigViewModel = require('../../../ui/src/serverConfig/serverConfigViewModel');
const ServerConfigItem = require('../../../ui/src/serverConfig/serverConfigItem');


describe('ServerConfigViewModel', function() {

    /**
     * @type {!ServerConfigViewModel}
     */
    let sut;

    let context;

    beforeEach(function() {
        // Setup stubs
        context = {
            adapter: {
                put: sinon.stub().resolves()
            }
        };

        // Setup subject under test
        sut = new ServerConfigViewModel(context);
    });

    describe('update', function() {
        it('sends a put request with the httpPort to /config', function() {
            // Given
            let item = new ServerConfigItem('8080', '');

            // When
            let promise = sut.update(item);

            // Then
            return promise.then(() => {
                let expectedBody = {
                    serverConfig: {
                        httpPort: '8080',
                        staticRoutes: []
                    }
                };
                expect(context.adapter.put).to.be.calledWith('/config', expectedBody);
            })
        });

        it('sends a put request with staticRoutes to /config', function() {
            // Given
            let item = new ServerConfigItem('8080', 'foo=/var/www/foo\nbar=/var/www/bar');

            // When
            let promise = sut.update(item);

            // Then
            return promise.then(() => {
                let expectedBody = {
                    serverConfig: {
                        httpPort: '8080',
                        staticRoutes: [{
                            name: 'foo',
                            path: '/var/www/foo'
                        }, {
                            name: 'bar',
                            path: '/var/www/bar'
                        }]
                    }
                };
                expect(context.adapter.put).to.be.calledWith('/config', expectedBody);
            })
        });
    });
});
