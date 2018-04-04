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

const uiDistPath = './ui/dist/';
const git = require('gulp-git');

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
        './ui/src/style/fonts/**/*'
    ]).pipe(gulp.dest(uiDistPath + 'style/fonts/'));
}

function copyIcons() {
    return gulp.src([
        './ui/src/style/icons/**/*'
    ]).pipe(gulp.dest(uiDistPath + 'style/icons/'));
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
        .pipe(lessImport('yakjs-style.less'))
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
    gulp.watch('./ui/src/**/*.js', gulp.series(bundleJs));
    gulp.watch('./ui/src/style/icons/**/*', gulp.series(copyIcons));
}

function optimzeSvg() {
    return gulp.src('./ui/src/style/icons/**/*.svg', {base: './'})
        .pipe(svgo())
        .pipe(gulp.dest('./'))
}

const buildServer = gulp.series(lint, test);

const copyFiles = gulp.parallel(copyScripts, copyFonts, copyIcons, copyLogo, copyStaticAssets);
const buildUserInterface = gulp.series(clean, copyFiles, createCss, bundleJs, bundleTemplates, renderIndexHtml);

const buildAll = gulp.series(buildServer, buildUserInterface);
const buildDev = gulp.series(buildServer, buildUserInterface, watch);

gulp.task('push-origin-master', () => {
    return git.push('origin', 'master', {args: ' --tags'});
});

gulp.task('tag-version', () => {
    return git.tag(`v${pkg.version}`, `Updates version number to "${pkg.version}".`);
});

gulp.task('checkNonSnapshotVersion', checkNonSnapshotVersion);
const prepublish = gulp.series(buildAll, 'checkNonSnapshotVersion', 'tag-version', 'push-origin-master');

// Tools
gulp.task('svgo', optimzeSvg);

// Development Tasks
gulp.task('prepublish', prepublish);
gulp.task('server', buildServer);
gulp.task('ui', buildUserInterface);
gulp.task('dev', buildDev);
gulp.task('default', buildAll);
