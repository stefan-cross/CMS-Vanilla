var gulp = require('gulp-param')(require('gulp'), process.argv);
var bower = require('gulp-bower');
var download = require('gulp-download');
var fs = require('fs');
var bowerRequireJS = require('bower-requirejs');
var del = require('del');
var gzip = require('gulp-gzip');
var Q = require('q');
var params = require('gulp-param');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var inject = require('gulp-inject');
var series = require('stream-series');
var minifycss = require('gulp-minify-css');

var config = {"bowerDir": "./bower_components", "distDir": './www/dist'}

gulp.task('install', ['bower-update', 'composer-install', 'bower-require-js']);
gulp.task('update', ['bower-update', 'composer-install', 'bower-require-js']);

/** Clean tasks **/
gulp.task('clean', function (cb) {
    del([
        'html/bower_components',
        'html/config',
        'vendor',
        'cache/*',
        'logs/*'
    ], cb);
});

/** Clean tasks **/
gulp.task('clean-dist', function (cb) {
    return del([
        config.distDir+"/*", "!"+config.distDir+"/.gitignore"
    ], cb);
});

/** End Clean Tasks **/

/** Bower Tasks **/
gulp.task('bower-update', function() {
    return bower({ cmd: 'update'})
});


gulp.task('fonts', function(){
    return gulp.src(config.bowerDir + '/bootstrap/fonts/**.*')
        .pipe(gulp.dest('./www/fonts'))
})

gulp.task('compact-core-css', function(){
   return gulp.src([
       config.bowerDir + '/bootstrap/dist/css/bootstrap.css',
       config.bowerDir + '/bootstrap/dist/css/bootstrap-theme.css',
       config.bowerDir + '/angular/angular-csp.css',
       config.bowerDir + '/angular-bootstrap/ui-bootstrap-csp.css',
       config.bowerDir + '/animate.css/animate.css'
   ])
       .pipe(concat('main.css'))
       .pipe(rev())
       //.pipe(minifycss())
       .pipe(gulp.dest(config.distDir))
});

gulp.task('compact-cms-css', function(){
    return gulp.src([
        './includes/css/*.css'
    ])
        .pipe(concat('cmsApp.css'))
        .pipe(rev())
        //.pipe(minifycss())
        .pipe(gulp.dest(config.distDir))
});


gulp.task('compact-core-js', function() {
    return gulp.src([
        config.bowerDir + '/jquery/dist/jquery.js',
        config.bowerDir + '/angular/angular.js',
        config.bowerDir + '/angular-bootstrap/ui-bootstrap-tpls.min.js',
        config.bowerDir + '/angular-resource/angular-resource.min.js',
        config.bowerDir + '/angular-messages/angular-messages.min.js',
        config.bowerDir + '/angular-ui-router/release/angular-ui-router.min.js',
        config.bowerDir + '/remarkable-bootstrap-notify/bootstrap-notify.min.js',
        config.bowerDir + '/bootstrap/dist/js/bootstrap.min.js',
        config.bowerDir + '/ng-file-upload/ng-file-upload.min.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.distDir))
        .pipe(rev.manifest(config.distDir + '/manifest.json', {merge: true, base: './www/dist'}))
        .pipe(gulp.dest(config.distDir))
});

gulp.task('compact-cms-js', function() {
    return gulp.src([
        './app/module.js', './app/routes.js', './app/services/*.js', './app/controllers/*.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('cmsApp.js'))
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./www/dist'))
        .pipe(rev.manifest(config.distDir + '/manifest.json', {merge: true, base: './www/dist'}))
        .pipe(gulp.dest(config.distDir))
});

gulp.task('inject', function(){
    var target = gulp.src('./www/index.html');
    var vendorJsStream = gulp.src(['./www/dist/**/main*.js'], {read:false});
    var appJsStream = gulp.src(['./www/dist/**/cms*.js'], {read:false});
    var vendorCssStream = gulp.src(['./www/dist/**/main*.css'], {read:false});
    var appCssStream = gulp.src(['./www/dist/**/cms*.css'], {read:false});

    return target.pipe(inject(series(vendorJsStream, appJsStream, vendorCssStream, appCssStream), {relative:true}))
        .pipe(gulp.dest('./www'))
})

gulp.task('watch', function() {
    gulp.watch('./app/**/*.js', ['clean-dist', 'compact-core-js', 'compact-cms-js', 'compact-core-css', 'compact-cms-css']);
    gulp.watch('./includes/css/**/*.css');
});

gulp.task('build', ["compact-core-js", "compact-cms-js", 'compact-core-css', 'compact-cms-css', 'fonts'], function () {
    // TODO Move node_modules etc out of the work dir.
    return gulp.src(['./**', '!.git/**', '!dist/**', '!cache/**', '!logs/**', '!node_modules/**'], {realpath: true, "base" : "." })
        .pipe(tar('archive.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('dist'));
});




/** End Composer tasks **/