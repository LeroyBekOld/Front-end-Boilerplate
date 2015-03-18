var gulp = require('gulp');
var del = require('del');
var config = require('../../config').clean.production;

gulp.task('clean:production', function(callback) {
    del([config.path], callback)
});