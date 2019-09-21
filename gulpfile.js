var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'), //sass sourcemaps
    sass = require('gulp-sass'), //compile sass
    autoprefixer = require('gulp-autoprefixer'), //vendor prefixes
    uglify = require('gulp-uglify'), //minify js
    jshint = require('gulp-jshint'), //jshint
    concat = require('gulp-concat'), //concatenate files
    imagemin  = require('gulp-imagemin'), //optimize images
    browsersync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    beeper = require('beeper');



function onError(err) {
  beeper();
  console.log(err);
}
var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 1%', 'Firefox ESR']
};

//do sass related stuff
gulp.task('sass', function() {
  return gulp.src('css/*.scss')
    .pipe(plumber({
      errorHandler: onError    
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions)) 
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('css/compiled'))
});

//jshint as a separate tasks when I want it
gulp.task('jshint', function () {
  return gulp.src(['app/js/directives.js', 'app/js/filters.js', 'app/js/officepool.js', 'app/js/services.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});
//image minification as a separate tasks when I need it
gulp.task('images', function() {
  return gulp.src('app/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('app/build/images'))
});

//js related tasks
gulp.task('js', function () {
  return gulp.src(['js/scripts.js'])
    .pipe(plumber({
      errorHandler: onError    
    }))
    pipe(concat('js/scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});


//run of the mill node server
// gulp.task('server', function() {
//   return connect().use(serve(__dirname))
//     .listen(8080)
//     .on('listening', function() {
//       console.log('Server is running: view at http://localhost:8080');
//     });
// });

//browsersync
gulp.task('browsersync', function(cb) {
    return browsersync({
      server: {
        baseDir: '.'
      }
    }, cb);
});
//watch for changes - run tasks - reload browsers
gulp.task('watch', function() {
    gulp.watch('css/*.scss', ['sass', browsersync.reload]);
    //gulp.watch('app/js/*.js', ['js', browsersync.reload]);
});
//default task
gulp.task('default', ['sass', 'browsersync', 'watch']);