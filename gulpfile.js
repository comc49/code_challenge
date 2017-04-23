// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),
  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),
  // folders
  folder = {
    src: 'src/',
    build: 'build/'
  }
;

var babel        = require('gulp-babel');
var reactify = require('reactify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var p = folder.src + 'js/app.js'

//builds the app.js file which includes JSX to standard js
gulp.task('build', function() {
    return browserify({
      entries: p,
      transform: [reactify]
      })
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./build/js'))
});

//watch if files are changed and runs build task if change is detected
gulp.task('watch', function() {
  gulp.watch('src/js/*.{js,jsx}', ['build']);
});
