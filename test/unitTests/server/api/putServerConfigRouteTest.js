const path = require('path');
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

    /**
     * @type {!Object<string, string>}
     */
    let pkg;

    let request;

    let response;

    /**
     * @type {FsAdapter}
     */
    let fsAdapter;

    /**
     * @type {!Config}
     */
    let defaultConfig;

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

        fsAdapter = {
            writeJsonFile: sinon.stub().resolves()
        };

        defaultConfig = {
            port: '8790',
            frontendFolder: '../ui/dist/',
            staticRoutes: []
        };

        // Setup subject under test
        sut = proxyquire('../../../../server/src/routes/v1/config/putServerConfigRoute', {
            '../../../adapter/fsAdapter': fsAdapter,
            '../../../../config.json': defaultConfig
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
                let expectedConfig = Object.assign(defaultConfig, {
                    port: '8080'
                });
                expect(fsAdapter.writeJsonFile).to.be.calledWith(path.join(__dirname, '../../../../server/config.json'), expectedConfig);
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
