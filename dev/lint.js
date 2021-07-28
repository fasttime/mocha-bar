#!/usr/bin/env node

/* eslint-env node */

'use strict';

var lint = require('@fasttime/lint').lint;

lint({ src: ['*.js', 'dev/**/*.js'] }, { src: '*.ts', parserOptions: { project: 'tsconfig.json' } })
.catch
(
    function (reason)
    {
        console.error(reason);
        process.exitCode = 1;
    }
);
