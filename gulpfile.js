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
/*
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var concat       = require('gulp-concat');
var eslint       = require('gulp-eslint');
var filter       = require('gulp-filter');
//var plumber      = require('gulp-plumber');
var sass         = require('gulp-sass');
var newer        = require('gulp-newer');
var notify       = require('gulp-notify');
var reload       = browserSync.reload;
var sourcemaps   = require('gulp-sourcemaps');
var react = require('gulp-react');
*/

var babel        = require('gulp-babel');
var reactify = require('reactify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
 
/*
gulp.task('browserify', function() {
  return gulp.src(folder.src + '/js/app.js')
        .pipe(react()).pipe(babel())
        .pipe(browserify())
        .bundle()
        .pipe(source('bundle.js'))
        //Pass desired output filename to vinyl-source-stream
        // Start piping stream to tasks!
        .pipe(gulp.dest(folder.build+'/js'));
});
*/
var p = folder.src + 'js/app.js'
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
/*
.catch((err) => {
          console.log(err)
        });
        */
gulp.task('watch', function() {
  gulp.watch('src/js/*.{js,jsx}', ['build']);
});



/*
gulp.task('concat',  function() {
  return gulp.src(folder.src + '/js/app.js')
    .pipe(react()).pipe(babel(
      ))
    .pipe(gulp.dest(folder.build+'/js'));
});

*/
