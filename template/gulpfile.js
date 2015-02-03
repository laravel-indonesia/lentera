var gulp = require('gulp');
var fs = require('fs');
var jade = require('gulp-jade');
var minify = require('gulp-minify');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concatfile = require('gulp-concat');

var path = {
    'css': {
        'src': 'assets/scss/site.scss',
        'watch': 'assets/scss/**/*.scss',
        'dest': 'assets/css/'
    },
    'js': {
        'site': {
            'src': 'assets/js/src/*.js',
            'watch': 'assets/js/src/*.js',
            'dest': 'assets/js/',
            'concat': 'site.min.js'
        },
        'plugins': {
            'src': 'assets/js/plugins/*.js',
            'watch': 'assets/js/plugins/*.js',
            'dest': 'assets/js/',
            'concat': 'plugins.min.js'
        },
        'vendors': {
            'src': 'assets/js/vendors/*.js',
            'watch': 'assets/js/vendors/*.js',
            'dest': 'assets/js/',
            'concat': 'vendors.min.js'
        },
    },
    'jade': {
        'src': 'jade/*.jade',
        'watch': 'jade/**/*.jade',
        'dest': 'html/'
    }
}

// A display error function, to format and make custom errors more uniform
// Could be combined with gulp-util or npm colors for nicer output
var displayError = function(error) {

    // Initial building up of the error
    var errorString = '[' + error.plugin + ']';
    errorString += ' ' + error.message.replace("\n",'. '); // Removes new line at the end

    // If the error contains the filename or line number add it to the string
    if(error.fileName)
        errorString += ' in ' + error.fileName;

    if(error.lineNumber)
        errorString += ' on line ' + error.lineNumber;

    // This will output an error like the following:
    // [gulp-sass] error message in file_name on line 1
    console.error(errorString);
}

gulp.task('js-site', function() {
    return gulp.src(path.js.site.src)
        .pipe(concatfile(path.js.site.concat))
        .pipe(uglify())
        .pipe(gulp.dest(path.js.site.dest));
});
gulp.task('js-plugins', function() {
    return gulp.src(path.js.plugins.src)
        .pipe(concatfile(path.js.plugins.concat))
        .pipe(uglify())
        .pipe(gulp.dest(path.js.plugins.dest));
});
gulp.task('js-vendors', function() {
    return gulp.src(path.js.vendors.src)
        .pipe(concatfile(path.js.vendors.concat))
        .pipe(gulp.dest(path.js.vendors.dest));
});

gulp.task('jade', function() {
    return gulp.src(path.jade.src)
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(path.jade.dest));
});

// ** WARNING !! **
//  Sass still buggy, should not be called
gulp.task('sass', function(cb) {
    return gulp.src(path.css.src)
        .pipe(sass({style: 'expanded'}))
        .on('error', function(err) {
            displayError(err);
            return cb();
        })
        .pipe(minify())
        .pipe(gulp.dest(path.css.dest));

});

gulp.task('default', ['jade']);

gulp.task('watch', function() {

  // Watch .js files
  gulp.watch(path.js.watch, ['js']);

  // Watch .scss files
  gulp.watch(path.css.watch, ['sass']);

  // Watch .jade files
  gulp.watch(path.jade.watch, ['jade']);

});