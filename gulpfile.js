/* eslint-env node */

'use strict';

var gulp = require('gulp');

var task = gulp.task;

function lint()
{
    var lint = require('gulp-fasttime-lint');

    var stream = lint({ src: '*.js' });
    return stream;
}

task(lint);
task('default', lint);
