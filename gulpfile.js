var gulp = require('gulp');
var util = require('gulp-util');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');

gulp.task('scripts', function (cb) {
    gulp.src('./lib/**/*.js')
        .pipe(browserify({
            basedir: './',
            debug: !util.env.production
        }))
        .pipe(concat('grid.js'))
        .pipe(gulp.dest('./dist/'))
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
        singleRun: false,
        autoWatch: true 
    }, function (exitCode) { 
        util.log('Karma has exited with ' + exitCode); 
        process.exit(exitCode); 
    });
});