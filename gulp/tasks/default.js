var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', ['clean:development'], function() {
    runSequence(
        'css:development',
        'javascript:development',
        'jade:development',
        'fonts:development',
        'images:development',
        'icons:development',
        'browser-sync:development',
        'watch'
    );
});