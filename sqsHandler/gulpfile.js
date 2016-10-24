var argv = require("yargs").argv;
var gulp = require("gulp");
var replace = require('gulp-replace');
var gulpif = require('gulp-if');

gulp.task('app.js', function(){
  	gulp.src(['./www/js/app.js'])
  	.pipe(gulpif(argv.size > 1, replace(/\/\* REMOVE IF COLLECTIONS > 2/g, '')))
  	.pipe(gulpif(argv.size > 1, replace(/REMOVE IF COLLECTIONS > 2 \*\//g, '')))
  	.pipe(gulpif(argv.size > 2, replace(/\/\* REMOVE IF COLLECTIONS > 3/g, '')))
  	.pipe(gulpif(argv.size > 2, replace(/REMOVE IF COLLECTIONS > 3 \*\//g, '')))
  	.pipe(gulpif(argv.size > 3, replace(/\/\* REMOVE IF COLLECTIONS > 4/g, '')))
  	.pipe(gulpif(argv.size > 3, replace(/REMOVE IF COLLECTIONS > 4 \*\//g, '')))
    .pipe(gulp.dest(argv.path));
});

gulp.task('controllers.js', function(){
  	gulp.src(['./www/js/controllers.js'])
  	.pipe(replace(/COLLECTION_TITLE1/g, argv.title1))
  	.pipe(gulpif(argv.size > 1, replace(/\/\* REMOVE IF COLLECTIONS > 2/g, '')))
  	.pipe(gulpif(argv.size > 1, replace(/REMOVE IF COLLECTIONS > 2 \*\//g, '')))
  	.pipe(gulpif(argv.size > 1, replace(/COLLECTION_TITLE2/g, argv.title2)))
  	.pipe(gulpif(argv.size > 2, replace(/\/\* REMOVE IF COLLECTIONS > 3/g, '')))
  	.pipe(gulpif(argv.size > 2, replace(/REMOVE IF COLLECTIONS > 3 \*\//g, '')))
  	.pipe(gulpif(argv.size > 2, replace(/COLLECTION_TITLE3/g, argv.title3)))
  	.pipe(gulpif(argv.size > 3, replace(/\/\* REMOVE IF COLLECTIONS > 4/g, '')))
  	.pipe(gulpif(argv.size > 3, replace(/REMOVE IF COLLECTIONS > 4 \*\//g, '')))
  	.pipe(gulpif(argv.size > 3, replace(/COLLECTION_TITLE4/g, argv.title4)))
    .pipe(gulp.dest(argv.path));
});

gulp.task('tabs', function(){
  	gulp.src(['./www/templates/tabs.html'])
  	.pipe(replace(/COLLECTION_TITLE1/g, argv.title1))
  	.pipe(replace(/COLLECTION_ICON1/g, argv.icon1))
  	.pipe(replace(/COLLECTION_ICON1/g, argv.icon1))
  	.pipe(gulpif(argv.size > 1, replace(/<!-- REMOVE IF COLLECTIONS > 2/g, '')))
  	.pipe(gulpif(argv.size > 1, replace(/REMOVE IF COLLECTIONS > 2-->/g, '')))
  	.pipe(gulpif(argv.size > 1, replace(/COLLECTION_TITLE2/g, argv.title2)))
  	.pipe(gulpif(argv.size > 1, replace(/COLLECTION_ICON2/g, argv.icon2)))
  	.pipe(gulpif(argv.size > 1, replace(/COLLECTION_ICON2/g, argv.icon2)))
  	.pipe(gulpif(argv.size > 2, replace(/<!-- REMOVE IF COLLECTIONS > 3/g, '')))
  	.pipe(gulpif(argv.size > 2, replace(/REMOVE IF COLLECTIONS > 3-->/g, '')))
  	.pipe(gulpif(argv.size > 2, replace(/COLLECTION_ICON3/g, argv.icon3)))
  	.pipe(gulpif(argv.size > 2, replace(/COLLECTION_ICON3/g, argv.icon3)))
  	.pipe(gulpif(argv.size > 2, replace(/COLLECTION_TITLE3/g, argv.title3)))
  	.pipe(gulpif(argv.size > 3, replace(/<!-- REMOVE IF COLLECTIONS > 4/g, '')))
  	.pipe(gulpif(argv.size > 3, replace(/REMOVE IF COLLECTIONS > 4-->/g, '')))
  	.pipe(gulpif(argv.size > 3, replace(/COLLECTION_TITLE4/g, argv.title4)))
  	.pipe(gulpif(argv.size > 3, replace(/COLLECTION_ICON4/g, argv.icon4)))
  	.pipe(gulpif(argv.size > 3, replace(/COLLECTION_ICON4/g, argv.icon4)))
    .pipe(gulp.dest(argv.path));
});