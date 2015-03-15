var gulp = require('gulp');
var del = require('del');
var config = require('../../config').clean.development;

gulp.task('clean:development', function(callback) {
    del([config.path], callback)
});