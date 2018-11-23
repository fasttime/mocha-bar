/* eslint-env node */

'use strict';

var gulp = require('gulp');

gulp.task
(
    'lint',
    function ()
    {
        var lint = require('gulp-fasttime-lint');

        var src = '*.js';
        var stream = gulp.src(src).pipe(lint());
        return stream;
    }
);

gulp.task('default', ['lint']);
