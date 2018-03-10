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
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const mustache = require('gulp-mustache');

const pkg = require('./package.json');
const uiDistPath = './ui/dist/';
const convertToHtmlTemplate = require('./gulp/convertToHtmlTemplate');

const babelLoader = {
    test: /.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    query: {
        presets: ['es2015']
    }
};

function clean() {
    return del(['./ui/dist/']);
}

function lint() {
    return gulp.src(['**/*.js', '!node_modules/**', '!ui/dist/**/*', '!ui/ext/**/*', '!ui/**/*', '!test/**/*', '!bin/**/*', '!gulpfile.js'])
        .pipe(eslint({
            fix: true,
            cache: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function test() {
    return gulp.src('test/unitTests/**/*Test.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
}

function copyScripts() {
    return gulp.src([
        './ui/ext/**/*'
    ]).pipe(gulp.dest(uiDistPath + 'ext/'));
}

function copyFonts() {
    return gulp.src([
        './ui/src/style/icons/**/*'
    ]).pipe(gulp.dest(uiDistPath + 'style/icons/'));
}

function copyIcons() {
    return gulp.src([
        './ui/src/style/fonts/**/*'
    ]).pipe(gulp.dest(uiDistPath + 'style/fonts/'));
}

function copyStaticAssets() {
    return gulp.src([
        './ui/src/*.png',
        './ui/src/*.xml',
        './ui/src/*.svg',
        './ui/src/*.json',
    ]).pipe(gulp.dest(uiDistPath));
}

function copyLogo() {
    return gulp.src([
        './ui/src/style/*.svg'
    ]).pipe(gulp.dest(uiDistPath + 'style/'));
}

function createCss() {
    return gulp.src([
        './ui/src/**/*.less'
    ])
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(concat('yakjs-style.css'))
        .pipe(gulp.dest(uiDistPath + 'style/'));
}

function bundleJs() {
    return gulp.src('./ui/src/index.js')
        .pipe(webpackStream({
            module: {
                loaders: [babelLoader]
            },
            plugins: [
                new webpack.IgnorePlugin(/i18next/),
            ]
        }))
        .pipe(rename({basename: pkg.name + '-ui'}))
        .pipe(gulp.dest(uiDistPath));
}

function bundleTemplates() {
    return gulp.src(['./ui/src/**/*.mustache', '!./ui/src/index.mustache'])
        .pipe(convertToHtmlTemplate())
        .pipe(concat('templates.html'))
        .pipe(gulp.dest(uiDistPath));
}

function renderIndexHtml() {
    const templates = fs.readFileSync('./ui/dist/templates.html', 'utf8');

    return gulp.src('./ui/src/index.mustache')
        .pipe(mustache({templates}))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest(uiDistPath));
}

function watch() {
    gulp.watch('./ui/src/**/*.less', gulp.series(createCss));
    gulp.watch('./ui/src/**/*.mustache', gulp.series(bundleTemplates, renderIndexHtml));
    gulp.watch('./ui/src/**/*.js', gulp.series(bundleJs));
}

const buildServer = gulp.series(lint, test);

const copyFiles = gulp.parallel(copyScripts, copyFonts, copyIcons, copyLogo, copyStaticAssets);
const buildUserInterface = gulp.series(clean, copyFiles, createCss, bundleJs, bundleTemplates, renderIndexHtml);

const buildAll = gulp.series(buildServer, buildUserInterface);
const buildDev = gulp.series(buildServer, buildUserInterface, watch);

gulp.task('server', buildServer);
gulp.task('ui', buildUserInterface);
gulp.task('default', buildAll);
gulp.task('dev', buildDev);
