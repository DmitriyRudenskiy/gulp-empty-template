const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const server = {
    host: 'localhost',
    port: '3000'
}

const paths = {
    build: 'build',
    dest: 'dist',
    source: 'src'
};

gulp.task('img', function () {
    return gulp.src(paths.source + '/img/**/*')
        .pipe($.imagemin({progressive: true, interlaced: true}))
        .pipe(gulp.dest(paths.dest + '/img'));
});

gulp.task('css', function () {
    return gulp.src(paths.dest + '/*.css')
        .pipe($.csslint())
        .pipe($.csslint.reporter())
        .pipe($.autoprefixer())
        .pipe($.concat('style.css'))
        .pipe($.cssnano())
        .pipe(gulp.dest(paths.dest + '/css'));
});

gulp.task('sprites', function () {

    var spriteOutput = gulp.src(paths.dest + "/css/*.css")
        .pipe($.spriteGenerator({
            baseUrl: paths.dest + "/img/sprite",
            spriteSheetName: "sprite.png",
            spriteSheetPath: paths.dest + "/img/sprite"
        }));

    spriteOutput.css.pipe(gulp.dest(paths.dest + "/css"));
    spriteOutput.img.pipe(gulp.dest(paths.dest + "/img"));
});

gulp.task('templates2', function () {

    console.log('I work');
    gulp.src('./templates/*.html')
        .pipe($.swig())
        .pipe(gulp.dest('./dist/'))
});

gulp.task('templates', function () {
    var getJsonData = function (file) {
        console.log(file);
        return require('/examples/' + path.basename(file.path) + '.json');
    };

    return gulp.src('/templates/**/*')
        .pipe($.data(getJsonData))
        .pipe($.swig())
        .pipe(gulp.dest('build'));
});

gulp.task('html', function () {
    gulp.src(paths.source + '/*.html')
        .pipe($.htmlhint())
        .pipe($.htmlhint.reporter())
        .pipe(
            $.inject(
                gulp.src([paths.dest + '/js/*.js', paths.dest + '/css/*.css'], {read: false})
            )
        )
        .pipe($.htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            preserveLineBreaks: true
        }))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('webserver', function () {
    gulp.src('app')
        .pipe($.webserver({
            host: server.host,
            port: server.port,
            path: paths.dist,
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task('build', ['img', 'css', 'sprites', 'html']);

gulp.task('default', ['build', 'webserver']);