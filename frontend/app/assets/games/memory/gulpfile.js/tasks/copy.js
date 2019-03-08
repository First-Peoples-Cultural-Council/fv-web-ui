var gulp  = require('gulp')
var clean = require('gulp-clean');
var merge = require('merge-stream');

gulp.task('copy', (cb)=>{
    var copyAssets = gulp.src(['./assets/**/*']).pipe(gulp.dest('./www/assets'));
    var copyIndex  = gulp.src(['./index.html']).pipe(gulp.dest('./www'));
    return merge(copyAssets, copyIndex);
});