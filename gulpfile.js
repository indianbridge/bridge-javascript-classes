
// Include gulp
var gulp = require('gulp');
 // Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
 // Concatenate JS Files
gulp.task('scripts', function() {
    return gulp.src(['./bridge.core.js', './bridge.deal.js', './bridge.card.js', './bridge.hand.js', './bridge.call.js', './bridge.auction.js', './bridge.contract.js', './bridge.play.js', './bridge.playedcard.js', './bridge.ui.js', './bridge.templates.js'])
      .pipe(concat('bridge.all.js'))
      .pipe(gulp.dest('./'))
      .pipe(gulp.dest('/Users/nsri/Documents/bridge/bridgewinners-app/www/js'));
});
// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['./bridge.core.js', './bridge.deal.js', './bridge.card.js', './bridge.hand.js', './bridge.call.js', './bridge.auction.js', './bridge.contract.js', './bridge.play.js', './bridge.playedcard.js', './bridge.ui.js', './bridge.templates.js'], ['scripts']);
});
 // Default Task
gulp.task('default', ['scripts']);
