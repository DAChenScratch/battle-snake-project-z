const gulp = require('gulp');
const browserify = require('browserify');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const buffer = require('vinyl-buffer');
// const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
// const sourcemaps = require('gulp-sourcemaps');
const log = require('gulplog');

gulp.task('ts', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('dist'));
});

gulp.task('web', () => {
    return browserify({
        entries: './dist/web.js',
        debug: true
    })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        // .pipe(sourcemaps.init({ loadMaps: true }))
        // .pipe(uglify())
        .on('error', log.error)
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./debug/'));
});

gulp.task('default', gulp.series('ts', 'web'));

gulp.task('watch', gulp.series('ts', 'web', () => {
    return gulp.watch(['src/**/*.ts'], gulp.series('default'));
}));
