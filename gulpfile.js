var gulp = require('gulp');
var sequence = require('run-sequence');
var clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src('./dist', { read: false })
        .pipe(clean());
});

gulp.task('html', function(){
    return gulp.src('./index.html')
        .pipe(gulp.dest('./dist/build'))
})

gulp.task('test', function () {
    gulp.src('./test/*')
        .pipe(gulp.dest('./dist/test'))
});

gulp.task('build', function (cb) {
    sequence('clean', ['html', 'test'], cb);
});

gulp.task('dev-build', function (cb) {
    sequence('clean', ['html', 'test'], cb);
});

gulp.task('default', function (cb) {
    sequence('dev-build', cb)
});