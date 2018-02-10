const proxyquire =  require('proxyquire');
const HttpStatus = require('http-status-codes');

const sandbox = require('../../../testSandbox');
const sinon = sandbox.sinon;
const expect = sandbox.expect;

describe('putServerConfigRoute', function() {
    'use strict';

    /**
     * @type {function(object, object)}
     */
    let sut;

    let request;

    let response;

    /**
     * @type {!ConfigProvider}
     */
    let configProvider;

    beforeEach(function() {
        // Setup stubs

        request = {
            body: {
            }
        };

        response = {
            send: sinon.stub().resolves()
        };
        response.status = sinon.stub().returns(response);

        configProvider = {
            config: {
                port: '8790',
                frontendFolder: '../ui/dist/',
                staticRoutes: []
            },
            update: sinon.stub().resolves()
        };

        // Setup subject under test
        sut = proxyquire('../../../../server/src/routes/v1/config/putServerConfigRoute', {
            '../../../config/configProvider': configProvider
        });
    });

    describe('put', function() {
        let clock;

        beforeEach(() => {
            clock = sinon.useFakeTimers();
            clock.tick(new Date().valueOf());
        });

        afterEach(() => clock.restore());

        it('sends a 200 response', function() {
            // Given
            request.body.serverConfig = {};

            // When
            let promise = sut(request, response);

            // Then
            return promise.then(() => {
                expect(response.send).to.be.called();
            });
        });

        it('updates the server config in the file system', function() {
            // Given
            request.body.serverConfig = {
                port: '8080'
            };

            // When
            let promise = sut(request, response);

            // Then
            return promise.then(() => {
                let expectedConfig = Object.assign(configProvider.config, {
                    port: '8080'
                });
                expect(configProvider.update).to.be.calledWith(expectedConfig);
            });
        });

        it('sends a BAD_REQUEST response when serverConfig is missing in body.', function() {
            // Given
            request.body = {};

            // When
            let promise = sut(request, response);

            // Then
            return promise.then(() => {
                expect(response.status).to.be.calledWith(HttpStatus.BAD_REQUEST);
                expect(response.send).to.be.calledWith({message: 'The request body does not contain a JSON object with a serverConfig property.'});
            })
        });
    });
});
