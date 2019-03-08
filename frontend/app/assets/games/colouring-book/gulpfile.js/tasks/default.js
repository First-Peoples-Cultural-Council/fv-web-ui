var gulp            = require('gulp')
var gulpSequence    = require('gulp-sequence')

gulp.task('default', (cb)=>{
    gulpSequence('clean','copy', 'webpack-dev-server', cb);
});