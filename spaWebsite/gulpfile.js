var gulp = require("gulp");
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var less = require("gulp-less");

gulp.task('less', function () {
	return gulp.src('./app/*.less')
	.pipe(less({}))
	.pipe(gulp.dest('./app'));
});

gulp.task('serve', [], function() {
  	browserSync({
		server: {
			baseDir: './'
		}
	});

	gulp.watch('./app/*.less', ['less']);
	gulp.watch(['./templates/*.html', './*.html','app/*.js'], {cwd: './'}, reload);
});