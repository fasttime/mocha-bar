/* eslint-env node */

'use strict';

var gulp = require('gulp');

var task = gulp.task;

function lint()
{
    var lint = require('@fasttime/lint').lint;

    var promise =
    lint({ src: '*.js' }, { src: '*.ts', parserOptions: { project: 'tsconfig.json' } });
    return promise;
}

task(lint);
task('default', lint);
