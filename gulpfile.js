'use strict';

const gulp = require('gulp');

const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

const pkg = require('./package.json');
const {checkNonSnapshotVersion} = require('./gulp/checkNonSnapshotVersion');
const {buildFrontendPages} = require('./gulp/buildFrontendPages');

const git = require('gulp-git');
const util = require('util');

const paths = {
    server: {
        src: './server/src/**/*.js'
    },
    test: {
        unitTests: {
            src: './test/unitTests/**/*Test.js'
        }
    }
};

function lint() {
    return gulp
        .src([paths.server.src])
        .pipe(eslint({
            fix: true,
            cache: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function test() {
    return gulp
        .src(paths.test.unitTests.src, {read: false})
        .pipe(mocha({reporter: 'nyan'}));
}

function pushOriginMaster() {
    const push = util.promisify(git.push);
    return push('origin', 'master', {args: ' --tags'});
}

function tagVersion() {
    const tag = util.promisify(git.tag);
    return tag(`v${pkg.version}`, `Update version number to "${pkg.version}"`);
}

const buildServer = gulp.series(lint, test);

/**
 * Define tasks that can automate some developer work.
 */
exports.lint = lint;

/*
 * Define tasks that are used by npm scripts or hooks.
 */
exports.prepublish = gulp.series(buildServer, checkNonSnapshotVersion, tagVersion, pushOriginMaster);

exports.buildFrontend = gulp.series(buildFrontendPages);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = buildServer;


