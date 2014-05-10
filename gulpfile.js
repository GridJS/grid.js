'use strict';

var gulp = require('gulp');
var util = require('gulp-util');

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var uglify = require('gulp-uglify');

gulp.task('browserify', function() {
    return browserify(__dirname + '/lib/grid.js')
        .bundle()
        .pipe(source('grid.js'))
        .pipe(gulp.dest(__dirname + '/dist'));
});

gulp.task('uglify', function() {
    return gulp.src(__dirname + '/dist/*.js')
        .pipe(uglify(/* {outSourceMap: true} */))
        .pipe(gulp.dest(__dirname + '/dist'));
});

gulp.task('build', ['browserify']);

gulp.task('bump', function () {
    gulp.src('./*.json')
        .pipe(bump({ type:'patch' }))
        .pipe(gulp.dest('./'));
});

gulp.task('npm', function (cb) {
    spawn('npm', ['publish'], { stdio: 'inherit' })
        .on('close', function (code) {
            cb(code !== 0);
        });
});

gulp.task('commit', function (cb) {
    var pkg = require('./package.json');
    var v = 'v' + pkg.version;
    var message = 'Release ' + v;

    spawn('git', ['commit', '-a', '-m', message], { stdio: 'inherit' })
        .on('close', function (code) {
            cb(code !== 0);
        });
});

gulp.task('tag', function (cb) {
    var pkg = require('./package.json');
    var v = 'v' + pkg.version;

    spawn('git', ['tag', v], { stdio: 'inherit' })
        .on('close', function (code) {
            cb(code !== 0);
        });
});

gulp.task('push', function (cb) {
    spawn('git', ['push', 'origin', 'master', '--tags'], { stdio: 'inherit' })
        .on('close', function (code) {
            cb(code !== 0);
        });
});

gulp.task('publish', function (cb){
    runSequence('commit', 'tag', 'push', cb);
});

gulp.task('deploy', function (cb) {
    runSequence('build', 'uglify', 'bump', 'npm', 'publish', cb);
});

var karma = require('karma').server;
var testFiles = [
    'test/**/*.spec.js'
];

gulp.task('test', function () {
    karma.start({
        browsers: ['Chrome'],
        files: testFiles,
        frameworks: ['mocha', 'browserify'],
        reporters: ['spec'],
        preprocessors: { 'test/**/*.js': ['browserify'] },
        singleRun: true
    }, function (exitCode) {
        util.log('Karma has exited with ' + exitCode);
        process.exit(exitCode);
    });
});

gulp.task('default', function() {
    karma.start({
        browsers: ['Chrome'],
        files: testFiles,
        browserify: {
            watch: true,
            debug: true
        },
        frameworks: ['mocha', 'browserify'],
        preprocessors: { 'test/**/*.js': ['browserify'] },
        reporters: ['spec'],
        singleRun: false,
        autoWatch: true
    }, function (exitCode) {
        util.log('Karma has exited with ' + exitCode);
        process.exit(exitCode);
    });
});
