'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
 
gulp.task('sass', function () {
  return gulp.src('./html/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./html'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./html/**/*.scss', ['sass']);
});