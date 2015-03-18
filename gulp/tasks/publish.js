var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('publish', ['clean:production'], function() {
    runSequence(
        'css:production',
        'javascript:production',
        'jade:production',
        'fonts:production',
        'images:production',
        'icons:production',
        'browser-sync:production'
    );
});