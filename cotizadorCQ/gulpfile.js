var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var templates = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');
var importCss = require('gulp-import-css');
var gulpCopy = require('gulp-copy');
// Minify and templateCache your Angular Templates
// Add a 'templates' module dependency to your app:
// var app = angular.module('appname', [ ... , 'templates']);

gulp.task('build', ['copiar', 'default', 'css']);

gulp.task('templates', function () {
  gulp.src([
      'app/**/*.html',
      '!./node_modules/**'
    ])
    .pipe(minifyHTML({
      quotes: true
    }))
    .pipe(templates('templates.js'))
    .pipe(gulp.dest('tmp'));
});

gulp.task('copiar', function(){
  gulp.src(['app/**/*, fonts/*, imagenes/*, librerias/*'])
    .pipe(gulp.dest('dist/app'));
});

// Concat and uglify all your JavaScript

gulp.task('default', function() {
  gulp.src([
      '!app/constantes/**/*.js',
      '!app/servicios/**/*.js',
      'app/**/*.js'
    ])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
 
gulp.task('css', function () {
  gulp.src('app/**/*.css')
    .pipe(concat('index1.css'))
    .pipe(importCss())
    .pipe(gulp.dest('dist/app/css/'));
});
