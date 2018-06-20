'use strict'

// dokumentasi
// https://css-tricks.com/gulp-for-beginners/


var gulp = require('gulp'),
    sass = require('gulp-sass'),
		watch = require('gulp-watch'),
		browserSync = require('browser-sync').create(),
		useref = require('gulp-useref'),
		uglify = require('gulp-uglify'),
		gulpIf = require('gulp-if'),
		cssnano = require('gulp-cssnano'),
		imagemin = require('gulp-imagemin'),
		cache = require('gulp-cache'),
		del = require('del'),
		runSequence = require('run-sequence'),
		autoprefixer = require('gulp-autoprefixer'),
		sourcemaps = require('gulp-sourcemaps');


gulp.task('hello', function() {
	console.log('Hello World');
});

gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss')
      .pipe(sourcemaps.init())
		.pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app',
			routes: {
				"/bower_components": "bower_components"
			}
		},
	})
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('images'))
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest(''))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('fonts'))
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!images', '!images/**/*']);
});

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/scss/**/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});


gulp.task('build', function (callback) {
  runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})
