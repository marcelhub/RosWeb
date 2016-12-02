var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

//handlebars
gulp.task('handlebars', function () {
    gulp.src(['src/templates/*.hbs',
            'src/widgets/**/**/*.hbs'])
      .pipe(handlebars())
      .pipe(wrap('Handlebars.template(<%= contents %>)'))
      .pipe(declare({
          namespace: 'MyApp.templates',
          noRedeclare: true, // Avoid duplicate declarations
      }))
      .pipe(concat('templates.js'))
      .pipe(gulp.dest('dist'));
});

//sass
gulp.task('sass', function () {
  return gulp
    .src('src/scss/*.scss')
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(gulp.dest('src/css/'));
});

//---DEFAULT TASK---
gulp.task('default', ['sass', 'handlebars'], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});