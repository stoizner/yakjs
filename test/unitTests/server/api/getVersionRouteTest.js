const sandbox = require('../../../testSandbox');
const sinon = sandbox.sinon;
const expect = sandbox.expect;
const proxyquire =  require('proxyquire');


describe('getVersionRoute', function() {
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
     * @type {!NpmCliAdapter}
     */
    let npmCliAdapter;

    beforeEach(function() {
        // Setup stubs
        pkg = {
            version: '0.1.0'
        };

        request = {};

        response = {
            send: sinon.stub()
        };
        response.status = sinon.stub().returns(response);

        npmCliAdapter = {
            show: sinon.stub().resolves({})
        };

        // Setup subject under test
        sut = proxyquire('../../../../server/src/routes/v1/package/getVersionRoute', {
            '../../../../../package': pkg,
            '../../../adapter/npmCliAdapter': npmCliAdapter
        });
    });

    describe('get', function() {
        let clock;

        beforeEach(() => {
            clock = sinon.useFakeTimers();
            clock.tick(new Date().valueOf());
        });

        afterEach(() => clock.restore());

        it('returns the version info and isNewVersionAvailable is set to true', function() {
            // Given
            pkg.version = '1.0.0';
            npmCliAdapter.show.resolves(createNpmInfoOutput('2.0.0'));

            // When
            let promise = sut(request, response);

            // Then
            let expectedVersionInfo = {
                version: '1.0.0',
                lastReleasedVersion: '2.0.0',
                isNewVersionAvailable: true,
            };
            return promise.then(() => {
                expect(response.send).to.be.calledWith(expectedVersionInfo);
            })
        });

        it('returns the version info and isNewVersionAvailable is set to false', function() {
            // Given
            pkg.version = '2.0.0';
            npmCliAdapter.show.resolves(createNpmInfoOutput('2.0.0'));

            // When
            let promise = sut(request, response);

            // Then
            let expectedVersionInfo = {
                version: '2.0.0',
                lastReleasedVersion: '2.0.0',
                isNewVersionAvailable: false,
            };
            return promise.then(() => {
                expect(response.send).to.be.calledWith(expectedVersionInfo);
            })
        });

        it('gets the npm version via npm show', function() {
            // Given
            pkg.version = '2.0.0';
            npmCliAdapter.show.resolves(createNpmInfoOutput('2.0.0'));

            // When
            let promise = sut(request, response);

            // Then
            return promise.then(() => {
                expect(npmCliAdapter.show).to.be.calledWith('yakjs');
            })
        });

        it('gets the npm version via npm show (after one day)', function() {
            // Given
            pkg.version = '2.0.0';
            npmCliAdapter.show.resolves(createNpmInfoOutput('2.0.0'));
            let firstPromise = sut(request, response);

            // When
            let promise = firstPromise.then(() => {
                npmCliAdapter.show.reset();
                npmCliAdapter.show.resolves(createNpmInfoOutput('2.0.0'));
                // Move one day ahead.
                clock.tick((1000 * 60 * 60 * 24));
                return sut(request, response);
            });

            // Then
            return promise.then(() => {
                expect(npmCliAdapter.show).to.be.calledWith('yakjs');
            });
        });

        it('does not the npm version via npm show (only once per day)', function() {
            // Given
            pkg.version = '2.0.0';
            npmCliAdapter.show.resolves(createNpmInfoOutput('2.0.0'));
            let firstPromise = sut(request, response);

            // When
            let promise = firstPromise.then(() => {
                npmCliAdapter.show.reset();
                return sut(request, response);
            });

            // Then
            return promise.then(() => {
                expect(npmCliAdapter.show).not.to.be.calledWith('yakjs');
            });
        });
    });

    /**
     * @param {string} latestVersion
     * @returns {{dist_tag: {latest: *}}}
     */
    function createNpmInfoOutput(latestVersion) {
        return {
            'dist-tags': {
                latest: latestVersion
            }
        }
    }
});
