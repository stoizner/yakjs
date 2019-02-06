'use strict';

const path = require('path');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');

const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const less = require('gulp-less');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const svgo = require('gulp-svgo');
const lessImport = require('gulp-less-import');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const mustache = require('gulp-mustache');

const pkg = require('./package.json');
const convertToHtmlTemplate = require('./gulp/convertToHtmlTemplate');
const checkNonSnapshotVersion = require('./gulp/checkNonSnapshotVersion');

const git = require('gulp-git');
const util = require('util');

const paths = {
    ui: {
        src: './ui/src/',
        dist: './ui/dist/',
        ext: {
            src: './ui/ext/**/*'
        },
        code: {
            src: './ui/src/**/*.js'
        },
        template: {
            src: './ui/src/**/*.mustache'
        },
        style: {
            src: './ui/src/style/',
            dist: './ui/dist/style/',
            less: {
                src: './ui/src/**/*.less'
            },
            fonts: {
                src: './ui/src/style/fonts/**/*',
                dist: './ui/dist/style/fonts/'
            },
            icons: {
                src: './ui/src/style/icons/**/*',
                dist: './ui/dist/style/icons/'
            },
            svg: {
                src: './ui/src/**/*.svg'
            }
        }
    },
    server: {
        src: './server/src/**/*.js'
    },
    test: {
        unitTests: {
            src: './test/unitTests/**/*Test.js'
        }
    }
};

const filenames = {
    index: {
        mustache: 'index.mustache',
        js: 'index.js'
    },
    templates: 'templates.html'
};

const babelLoader = {
    test: /.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    query: {
        presets: ['es2015']
    }
};

function clean() {
    return del([paths.ui.dist]);
}

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

function copyDependencyScripts() {
    return gulp
        .src([paths.ui.ext.src])
        .pipe(gulp.dest(paths.ui.dist + 'ext/'));
}

function copyFonts() {
    return gulp.src([paths.ui.style.fonts.src]).pipe(gulp.dest(paths.ui.style.fonts.dist));
}

function copyIcons() {
    return gulp.src([paths.ui.style.icons.src]).pipe(gulp.dest(paths.ui.style.icons.dist));
}

function copyStaticAssets() {
    return gulp
        .src([
        './ui/src/*.png',
        './ui/src/*.xml',
        './ui/src/*.svg',
        './ui/src/*.json',
        ])
        .pipe(gulp.dest(paths.ui.dist));
}

function createCss() {
    return gulp
        .src([paths.ui.style.less.src])
        .pipe(lessImport('yakjs-style.less'))
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(concat('yakjs-style.css'))
        .pipe(gulp.dest(paths.ui.style.dist));
}

function bundleJs() {
    return gulp.src(paths.ui.src + filenames.index.js)
        .pipe(webpackStream({
            module: {
                loaders: [babelLoader]
            },
            plugins: [
                new webpack.IgnorePlugin(/i18next/),
            ]
        }))
        .pipe(rename({basename: pkg.name + '-ui'}))
        .pipe(gulp.dest(paths.ui.dist));
}

function bundleTemplates() {
    return gulp
        .src([paths.ui.template.src, '!' + paths.ui.src + filenames.index.mustache])
        .pipe(convertToHtmlTemplate())
        .pipe(concat(filenames.templates))
        .pipe(gulp.dest(paths.ui.dist));
}

function renderIndexHtml() {
    const templates = fs.readFileSync(paths.ui.dist + filenames.templates, 'utf8');

    return gulp
        .src(paths.ui.src + filenames.index.mustache)
        .pipe(mustache({templates}))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest(paths.ui.dist));
}

function watch() {
    gulp.watch(paths.ui.style.less.src, gulp.series(createCss));
    gulp.watch(paths.ui.template.src, gulp.series(bundleTemplates, renderIndexHtml));
    gulp.watch(paths.ui.code.src, gulp.series(bundleJs));
    gulp.watch(paths.ui.style.icons.src, gulp.series(copyIcons));
}

function optimzeSvg() {
    return gulp
        .src(paths.ui.style.svg.src, {base: './'})
        .pipe(svgo())
        .pipe(gulp.dest('./'))
}

function pushOriginMaster() {
    const push = util.promisify(git.push);
    return push('origin', 'master', {args: ' --tags'});
}

function tagVersion() {
    const tag = util.promisify(git.tag);
    return tag(`v${pkg.version}`, `Updates version number to ${pkg.version}.`);
}

const buildServer = gulp.series(lint, test);

const copyFiles = gulp.parallel(copyDependencyScripts, copyFonts, copyIcons, copyStaticAssets);
const buildUserInterface = gulp.series(clean, copyFiles, createCss, bundleJs, bundleTemplates, renderIndexHtml);

const buildAll = gulp.series(buildServer, buildUserInterface);
const buildAllAndWatch = gulp.series(buildAll, watch);

/**
 * Define tasks that can automate some developer work.
 */
exports.optimize = optimzeSvg;
exports.watch = buildAllAndWatch;
exports.lint = lint;

/*
 * Define tasks that are used by npm scripts or hooks.
 */
exports.prepublish = gulp.series(buildAll, checkNonSnapshotVersion, tagVersion, pushOriginMaster);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = buildAll;
