var gulp=require('gulp');
var plumber=require('gulp-plumber');
var jade=require('gulp-jade');

var htmlSrc='src/index.jade';

gulp.task('html',function(){
	gulp.src(htmlSrc)
		.pipe(plumber())
		.pipe(jade())
		.pipe(gulp.dest('public_html'));
});

gulp.task('watch',function(){
	gulp.watch(htmlSrc,['html']);
});

gulp.task('default',['html']);
