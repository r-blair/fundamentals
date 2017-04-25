var path         = require('path');
var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var tsc          = require('gulp-typescript');
var sourcemaps   = require('gulp-sourcemaps');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

const scssPath = path.join('src', 'scss', '**', '*.scss');
const tsPath = path.join('src', 'ts', '**', "*.ts");

var tsProj = tsc.createProject('./tsconfig.json');

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'tsc'], function() {

    browserSync.init({
        server: {
            baseDir: "./",
            directory: true
        }
    });

    gulp.watch(scssPath, ['sass']);
    gulp.watch(tsPath, ['tsc']);
    gulp.watch("./index.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(scssPath)
               .pipe(sass())
               .pipe(postcss([ autoprefixer()]))
               .pipe(gulp.dest("./dist/styles"))
               .pipe(browserSync.stream());
});

gulp.task('tsc', function() {
    return gulp.src(tsPath)
               .pipe(tsProj())
               .pipe(gulp.dest('./dist/scripts'))
               .pipe(browserSync.stream());

});

gulp.task('default', ['serve']);