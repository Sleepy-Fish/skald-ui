var gulp = require('gulp');

gulp.task('build', function(){
    return gulp.src('./index.html')
        .pipe(gulp.dest('./dist'))
})