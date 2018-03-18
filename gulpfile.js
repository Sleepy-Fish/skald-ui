var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var lint = require('gulp-eslint');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var merge = require('merge-stream');
var minifyJS = require('gulp-minify');
var minifyCSS = require('gulp-clean-css');
var purge = require('gulp-purgecss');
var inject = require('gulp-inject');
var sequence = require('run-sequence');

var config = require('./gulp.config');
var baseurl = config.protocol + '://' + config.domain;

gulp.task('connect', function () {
    return connect.server({
        root: [config.paths.dist.build],
        host: config.domain,
        port: config.port,
        base: baseurl,
        livereload: true
    });
});

gulp.task('open', ['connect'], function () {
    return gulp.src(config.entry)
        .pipe(open({ uri: baseurl + ':' + config.port + '/' }));
});

gulp.task('watch', function () {
    gulp.watch(config.paths.glob.html, ['html']);
    gulp.watch([config.paths.index.js, config.paths.glob.js], ['js', 'lint']);
    gulp.watch([config.paths.index.scss, config.paths.glob.scss], ['scss']);
    gulp.watch(config.paths.vendor.override + '*', ['vendor']);
});

gulp.task('lint', function () {
    return gulp.src(config.paths.glob.js)
        .pipe(lint({ configFile: 'eslint.config.json' }))
        .pipe(lint.format());
});

gulp.task('clean', function () {
    return gulp.src('./dist', { read: false })
        .pipe(clean());
});

gulp.task('html', function(){
    return gulp.src(config.paths.index.html)
        .pipe(gulp.dest(config.paths.dist.build))
        .pipe(connect.reload())
});

gulp.task('js', function () {
    return browserify(config.paths.index.js)
        .transform(babelify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist.build + '/js'))
        .pipe(connect.reload());
});

gulp.task('scss', function () {
    return gulp.src(config.paths.index.scss)
        .pipe(sass().on('error', console.error.bind(console)))
        .pipe(rename('bundle.css'))
        .pipe(gulp.dest(config.paths.dist.build + '/css'));
});

gulp.task('img', function () {
    return gulp.src(config.paths.img)
        .pipe(gulp.dest(config.paths.dist.build + '/img'));
})

gulp.task('vendor-override', function () {
    var overrides = []
    for (var override of config.paths.vendor.overrides) {
        overrides.push(gulp.src(config.paths.vendor.override + override.src)
            .pipe(rename(override.trg.file))
            .pipe(gulp.dest(override.trg.path)))
    }
    return merge(...overrides);
});

gulp.task('vendor-js', function () {
    return gulp.src(config.paths.vendor.js)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(config.paths.dist.build + '/js'));
});

gulp.task('vendor-css', function () {
    var scssStream = gulp.src(config.paths.vendor.scss)
        .pipe(sass().on('error', console.error.bind(console)))
        .pipe(concat('scss-files.scss'));

    var cssStream = gulp.src(config.paths.vendor.css)
        .pipe(concat('css-files.css'));

    return merge(scssStream, cssStream)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(config.paths.dist.build + '/css'));

});

gulp.task('vendor-fonts', function () {
    return gulp.src(config.paths.vendor.fonts)
        .pipe(gulp.dest(config.paths.dist.build + '/fonts'));
});

gulp.task('vendor', function (cb) {
    sequence('vendor-override', ['vendor-js', 'vendor-css', 'vendor-fonts'], cb);
});

gulp.task('minify', function () {
    var minifications = []
    minifications.push(
        gulp.src(config.paths.dist.build + '/js/*.js')
            .pipe(minifyJS({ ext: { src: '-debug.js', min: '.js' } }))
            .pipe(gulp.dest(config.paths.dist.build + '/js'))
    );
    minifications.push(
        gulp.src(config.paths.dist.build + '/index.html')
            .pipe(
                inject(gulp.src(config.paths.dist.build + '/css/*.css')
                    .pipe(concat('injected.css'))
                    .pipe(purge({
                        content: [config.paths.dist.build + '/index.html']
                    }))
                    .pipe(minifyCSS({ compatibility: 'ie8' })), {
                        transform: function (filepath, file) {
                            return "".concat(
                            '<style>',
                                file.contents.toString(),
                            '</style>',
                            '<link async href="./css/vendor.css">',
                            '<link async href="./css/bundle.css">'
                        );
                        },
                        starttag: '<!-- inject:style:css -->',
                        removeTags: true
                    }))
            .pipe(gulp.dest(config.paths.dist.build))
    );
    return merge(...minifications);
});

gulp.task('test', function () {
    gulp.src('./test/*')
        .pipe(gulp.dest('./dist/test'))
});

gulp.task('build', function (cb) {
    sequence('clean', ['html', 'js', 'scss', 'vendor', 'img', 'lint', 'test'], 'minify', cb);
});

gulp.task('dev-build', function (cb) {
    sequence('clean', ['html', 'js', 'scss', 'vendor', 'img', 'lint'], cb);
});

gulp.task('default', function (cb) {
    sequence('dev-build', ['open', 'watch'], cb)
});