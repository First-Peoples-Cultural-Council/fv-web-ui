var gulp  = require('gulp')
var clean = require('gulp-clean');

gulp.task('clean', (cb)=>{
    return gulp.src(['./www'],{read:false}).pipe(clean());
});