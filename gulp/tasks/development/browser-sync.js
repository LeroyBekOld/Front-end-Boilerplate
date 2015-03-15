var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('../../config').browserSync.development;

gulp.task('browser-sync:development', function() {
    browserSync(config)
});