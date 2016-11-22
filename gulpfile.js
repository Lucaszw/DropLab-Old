// requirements
var gulp = require('gulp');
var gulpBrowser = require("gulp-browser");
var reactify = require('reactify');
var del = require('del');
var dest = require('gulp-dest');
var size = require('gulp-size');

var scripts = ['./project/static/scripts/jsx/**/*.jsx'];

// tasks
gulp.task('transform', function () {
  var stream = gulp.src(scripts)
    .pipe(gulpBrowser.browserify({transform: ['reactify']}))
    .on('error', swallowError)
    .pipe(dest('./project/static/scripts/js/', {ext: '.js'}))
    .pipe(gulp.dest('./'))
    .pipe(size());
  return stream;
});

gulp.task('del', function () {
  return del(['./project/static/scripts/js']);
});

gulp.task('default', ['del'], function () {
  gulp.start('transform');
  gulp.watch('./project/static/scripts/jsx/**/*.jsx', ['transform']);
});

function swallowError (error) {
  // If you want details of the error in the console
  console.log(error.toString())
  this.emit('end')
}
