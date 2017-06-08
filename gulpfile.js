var gulp = require('gulp');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var run = require('gulp-run');
var rolluptypescript = require('rollup-plugin-typescript');
var typescript = require('typescript');

var package = require('./package.json');

gulp.task('typescript', function () {
    run('tsc').exec();
})

gulp.task('build', ['typescript'], function () {
    return rollup({
        entry: './main.ts',
        format: 'umd',
        moduleName: package.name,
        plugins: [
            rolluptypescript({
                typescript: typescript
            })
        ]
    })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist'));
});
